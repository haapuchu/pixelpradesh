const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo_cloud',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
});

async function run() {
  try {
    const ping = await cloudinary.api.ping();
    console.log('Ping status:', ping.status);
    const res = await cloudinary.api.resources({ max_results: 30, type: 'upload' });
    console.log('Found resources count:', res.resources.length);
    res.resources.forEach(r => {
      console.log(' - Public ID:', r.public_id, '| format:', r.format, '| url:', r.secure_url);
    });
  } catch (err) {
    console.error('Cloudinary API error:', err.message);
  }
}

run();
