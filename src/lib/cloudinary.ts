import { v2 as cloudinary } from 'cloudinary';
export * from '@/config/samples.config';

// Configure Cloudinary server-side SDK
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
});

export const isDemoMode = (): boolean => {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || !process.env.CLOUDINARY_API_KEY;
};

export interface UploadResult {
  publicId: string;
  url: string;
  width?: number;
  height?: number;
  format?: string;
  dominantColors?: string[];
  isLive: boolean;
}

// Upload helper: executes real Cloudinary API upload when keys are present, or returns fallback
export async function uploadAsset(
  fileBufferOrDataUri: string,
  fileName?: string
): Promise<UploadResult> {
  if (!isDemoMode()) {
    try {
      const cleanFileName = fileName
        ? fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')
        : undefined;

      const res = await cloudinary.uploader.upload(fileBufferOrDataUri, {
        folder: 'pixelpradesh_masters',
        colors: true,
        quality_analysis: true,
        public_id: cleanFileName,
      });

      const dominantColors = res.colors?.map(([hex]: [string, number]) => hex) || ['#f59e0b', '#dc2626'];

      return {
        publicId: res.public_id,
        url: res.secure_url,
        width: res.width,
        height: res.height,
        format: res.format,
        dominantColors,
        isLive: true,
      };
    } catch (err) {
      console.error('Cloudinary live upload error, falling back to local simulation:', err);
    }
  }

  // Demo fallback
  return {
    publicId: `pixelpradesh_master_${Date.now()}`,
    url: fileBufferOrDataUri,
    isLive: false,
    dominantColors: ['#f59e0b', '#16a34a', '#dc2626'],
  };
}

export { cloudinary };
