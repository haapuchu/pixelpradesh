const https = require('https');

const cloudName = 'dcgug3wg';
const publicId = 'adaptr_masters/kaju_katli_master';

const fontName = 'Noto_Sans_Devanagari';
const headline = encodeURIComponent('शुभ दीपावली');
const textLayer = `l_text:${fontName}_42_bold:${headline},co_rgb:ffffff,g_north,y_120`;

const urlWithIndicText = `https://res.cloudinary.com/${cloudName}/image/upload/c_pad,ar_1:1,b_gen_fill/${textLayer}/f_auto/q_auto/${publicId}.jpg`;

console.log('Testing Indic text:', urlWithIndicText);

https.get(urlWithIndicText, (res) => {
  console.log('Status code Indic:', res.statusCode);
  if (res.statusCode !== 200) {
    console.log('x-cld-error:', res.headers['x-cld-error']);
  }
}).on('error', (e) => {
  console.error('Error:', e.message);
});
