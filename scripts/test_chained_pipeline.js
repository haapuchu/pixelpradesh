const https = require('https');

const cloudName = 'dcgug3wg';
const publicId = 'adaptr_masters/kaju_katli_master';

const testCases = [
  {
    name: 'Hindi 1:1',
    ratio: '1:1',
    scene: 'festive Diwali background with glowing brass lamps and marigolds',
    headline: 'इस दिवाली मिठास अपनों के साथ',
    cta: 'अभी ऑर्डर करें',
  },
  {
    name: 'Bengali 9:16',
    ratio: '9:16',
    scene: 'Durga Puja festive celebration background with white Kash flowers',
    headline: 'পুজোর আনন্দে সাজুক প্রতিটি মুহূর্ত',
    cta: 'এখনই কিনুন',
  },
  {
    name: 'Tamil 16:9',
    ratio: '16:9',
    scene: 'Pongal harvest festival background with traditional banana leaf',
    headline: 'பொங்கல் திருநாள் இனிமை உங்கள் இல்லத்தில்',
    cta: 'இப்போதே வாங்குங்கள்',
  },
  {
    name: 'Meitei 1:1',
    ratio: '1:1',
    scene: 'Manipuri Ningol Chakouba festive background with traditional lotus and silk',
    headline: 'ꯅꯤꯉꯣꯜ ꯆꯥꯛꯀꯧꯕ ꯊꯧꯔꯝ',
    cta: 'ꯍꯧꯖꯤꯛ ꯂꯧꯕꯤꯌꯨ',
  },
];

async function run() {
  for (const tc of testCases) {
    const sceneSeg = `e_gen_background_replace:prompt_${encodeURIComponent(tc.scene)}`;
    const outpaintSeg = `c_pad,ar_${tc.ratio},b_gen_fill`;
    const headlineLayer = `l_text:arial_36_bold:${encodeURIComponent(tc.headline)},co_rgb:ffffff,g_north,y_80`;
    const ctaLayer = `l_text:arial_20_bold:${encodeURIComponent(tc.cta)},co_rgb:f59e0b,g_north,y_150,b_rgb:111827,r_12`;
    const edge = 'f_auto,q_auto';

    const url = `https://res.cloudinary.com/${cloudName}/image/upload/${sceneSeg}/${outpaintSeg}/${headlineLayer}/${ctaLayer}/${edge}/${publicId}.jpg`;
    console.log(`Testing ${tc.name}...`);
    await new Promise((resolve) => {
      https.get(url, (res) => {
        console.log(`${tc.name} => status: ${res.statusCode}`, res.statusCode === 200 ? 'SUCCESS' : res.headers['x-cld-error'] || 'ERR');
        resolve();
      });
    });
  }
}

run();
