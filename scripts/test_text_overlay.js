const https = require('https');

const cloudName = 'dcgug3wg';
const publicId = 'adaptr_masters/kaju_katli_master';

// Test with text overlay
const fontName = 'arial'; // Or Noto_Sans
const headline = encodeURIComponent('Diwali Special');
const textLayer = `l_text:${fontName}_42_bold:${headline},co_rgb:ffffff,g_north,y_120`;

const urlWithText = `https://res.cloudinary.com/${cloudName}/image/upload/c_pad,ar_1:1,b_gen_fill/${textLayer}/f_auto/q_auto/${publicId}.jpg`;

console.log('Testing URL with text:', urlWithText);

https.get(urlWithText, (res) => {
  console.log('Status code with text:', res.statusCode);
  if (res.statusCode !== 200) {
    console.log('x-cld-error:', res.headers['x-cld-error']);
  }
}).on('error', (e) => {
  console.error('Error:', e.message);
});
