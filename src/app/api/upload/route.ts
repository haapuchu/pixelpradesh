import { NextRequest, NextResponse } from 'next/server';
import { SAMPLE_PRODUCTS, uploadAsset, isDemoMode } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // Handle multipart/form-data file upload (real user image upload)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ success: false, error: 'No file found in request' }, { status: 400 });
      }

      // Convert file to base64 Data URL for serverless/local upload
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Data = `data:${file.type || 'image/jpeg'};base64,${buffer.toString('base64')}`;

      // Upload to Cloudinary (or fallback if in demo mode)
      const uploadResult = await uploadAsset(base64Data, file.name);

      return NextResponse.json({
        success: true,
        publicId: uploadResult.publicId,
        url: uploadResult.url,
        fileName: file.name,
        fileSize: file.size,
        isLiveCloudinary: uploadResult.isLive,
        dominantColors: uploadResult.dominantColors,
        name: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        category: 'Custom Product',
        brief: 'Festive regional promotional campaign for uploaded product.',
        cta: 'Shop Now',
      });
    }

    // Handle JSON payloads (sample selection or URL paste)
    const body = await req.json();
    const { sampleId, customUrl } = body;

    if (sampleId) {
      const sample = SAMPLE_PRODUCTS.find((p) => p.id === sampleId);
      if (sample) {
        return NextResponse.json({
          success: true,
          publicId: sample.masterPublicId,
          url: sample.thumbnailUrl,
          name: sample.name,
          category: sample.category,
          brief: sample.defaultBrief,
          cta: sample.defaultCta,
          isLiveCloudinary: false,
        });
      }
    }

    if (customUrl) {
      // If live Cloudinary is enabled, upload the remote URL to Cloudinary
      if (!isDemoMode()) {
        const uploadResult = await uploadAsset(customUrl);
        return NextResponse.json({
          success: true,
          publicId: uploadResult.publicId,
          url: uploadResult.url,
          isLiveCloudinary: uploadResult.isLive,
          name: 'Custom Product Asset',
          category: 'Custom Category',
          brief: 'Custom uploaded product asset for festive campaign localization.',
          cta: 'Shop Now',
        });
      }

      return NextResponse.json({
        success: true,
        publicId: `user_upload_${Date.now()}`,
        url: customUrl,
        isLiveCloudinary: false,
        name: 'Custom Product Asset',
        category: 'Custom Category',
        brief: 'Custom uploaded product asset for festive campaign localization.',
        cta: 'Shop Now',
      });
    }

    return NextResponse.json({ success: false, error: 'No file, sampleId, or customUrl provided' }, { status: 400 });
  } catch (error) {
    console.error('Upload handler error:', error);
    return NextResponse.json({ success: false, error: 'Upload processing failed' }, { status: 500 });
  }
}
