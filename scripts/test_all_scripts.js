const https = require('https');

const cloudName = 'dcgug3wg';
const publicId = 'adaptr_masters/kaju_katli_master';

const tests = [
  { name: 'Hindi', text: 'इस दिवाली, मिठास अपनों के साथ' },
  { name: 'Bengali', text: 'পুজোর আনন্দে সাজুক প্রতিটি মুহূর্ত' },
  { name: 'Tamil', text: 'பொங்கல் திருநாள் இனிமை உங்கள் இல்லத்தில்' },
  { name: 'Meitei', text: 'ꯅꯤꯉꯣꯜ ꯆꯥꯛꯀꯧꯕ' },
];

async function run() {
  for (const t of tests) {
    const encoded = encodeURIComponent(t.text);
    const url = `https://res.cloudinary.com/${cloudName}/image/upload/c_pad,ar_1:1,b_gen_fill/l_text:arial_32_bold:${encoded},co_rgb:ffffff,g_north,y_100/f_auto/q_auto/${publicId}.jpg`;
    await new Promise((resolve) => {
      https.get(url, (res) => {
        console.log(t.name, '=> status:', res.statusCode, 'error:', res.headers['x-cld-error'] || 'NONE');
        resolve();
      });
    });
  }
}

run();
