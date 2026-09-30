import { NextRequest, NextResponse } from 'next/server';
import { JobStore } from '@/lib/store';
import JSZip from 'jszip';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const job = JobStore.get(id);

  if (!job) {
    return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
  }

  try {
    const zip = new JSZip();
    const manifest = {
      campaignId: job.id,
      productName: job.productName,
      category: job.category,
      createdAt: job.createdAt,
      exportedAt: new Date().toISOString(),
      variantsCount: job.variants.length,
      variants: job.variants.map((v) => ({
        id: v.id,
        locale: v.metadata.locale,
        festival: v.metadata.festival,
        aspectRatio: v.metadata.ratio,
        headline: v.metadata.headline,
        cta: v.metadata.cta,
        cloudinaryRecipeUrl: v.recipeUrl,
        finalDeliveryUrl: v.finalUrl,
        compliancePassed: v.complianceResults.every((r) => r.passed),
      })),
    };

    // Add metadata manifest
    zip.file('campaign_manifest.json', JSON.stringify(manifest, null, 2));

    // Add Cloudinary URL recipe references list
    const recipeText = job.variants
      .map(
        (v) =>
          `[${v.metadata.festival} - ${v.metadata.ratio}]\nHeadline: ${v.metadata.headline}\nCTA: ${v.metadata.cta}\nCloudinary URL:\n${v.recipeUrl}\n\n`
      )
      .join('----------------------------------------\n');

    zip.file('cloudinary_recipes.txt', recipeText);

    // Fetch and embed sample images if possible or text bookmarks
    for (const v of job.variants) {
      const folderName = `${v.metadata.locale.replace(/[^a-zA-Z0-9]/g, '_')}_${v.metadata.festival}`;
      const fileName = `${v.metadata.ratio.replace(':', 'x')}_ad.url`;
      zip.folder(folderName)?.file(fileName, `[InternetShortcut]\nURL=${v.finalUrl}\n`);
    }

    const zipBuffer = await zip.generateAsync({ type: 'uint8array' });

    return new NextResponse(zipBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="PixelPradesh_${job.productName.replace(/[^a-zA-Z0-9]/g, '_')}_Campaign.zip"`,
      },
    });
  } catch (error) {
    console.error('Error generating ZIP:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate campaign archive.' },
      { status: 500 }
    );
  }
}
