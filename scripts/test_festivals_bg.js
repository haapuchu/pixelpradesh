const https = require('https');

const cloudName = 'dcgug3wg';
const publicId = 'adaptr_masters/kaju_katli_master';

const festivals = [
  { name: 'Diwali', prompt: 'festive Diwali background with glowing brass lamps and marigolds' },
  { name: 'Durga Puja', prompt: 'Durga Puja festive celebration background with white Kash flowers' },
  { name: 'Pongal', prompt: 'Pongal harvest festival background with traditional banana leaf' },
  { name: 'Ningol Chakouba', prompt: 'Manipuri Ningol Chakouba festive background with traditional lotus and silk' },
];

async function run() {
  for (const f of festivals) {
    const p = encodeURIComponent(f.prompt);
    const url = `https://res.cloudinary.com/${cloudName}/image/upload/e_gen_background_replace:prompt_${p}/c_pad,ar_1:1,b_gen_fill/f_auto/q_auto/${publicId}.jpg`;
    console.log(`Starting ${f.name}...`);
    await new Promise((resolve) => {
      https.get(url, (res) => {
        console.log(`${f.name} => status: ${res.statusCode}`);
        resolve();
      });
    });
  }
}

run();
