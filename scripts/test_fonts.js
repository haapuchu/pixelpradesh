const https = require('https');

const cloudName = 'dcgug3wg';
const publicId = 'adaptr_masters/kaju_katli_master';
const headline = encodeURIComponent('शुभ दीपावली');

const tests = [
  'l_text:arial_42_bold',
  'l_text:arial_42',
  'l_text:Arial_42',
  'l_text:roboto_42',
  'l_text:verdana_42',
];

async function run() {
  for (const t of tests) {
    const url = `https://res.cloudinary.com/${cloudName}/image/upload/c_pad,ar_1:1,b_gen_fill/${t}:${headline},co_rgb:ffffff,g_north,y_120/f_auto/q_auto/${publicId}.jpg`;
    await new Promise((resolve) => {
      https.get(url, (res) => {
        console.log(t, '=>', res.statusCode, res.headers['x-cld-error'] || 'OK');
        resolve();
      });
    });
  }
}

run();
