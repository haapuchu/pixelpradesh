const https = require('https');

// Cloudinary URL builder identical to transformations.ts
const cloudName = 'dcgug3wg';
const publicId = 'adaptr_masters/kaju_katli_master';

// Let's test the text layer
const headline = 'शुभ दीपावली';
const cta = 'ऑर्डर करें';
const fontName = 'Noto_Sans_Devanagari';

const testFullRecipe = `https://res.cloudinary.com/${cloudName}/image/upload/e_gen_background_replace:prompt_festive%20Diwali%20celebration/c_pad,ar_1:1,b_gen_fill/f_auto/q_auto/${publicId}.jpg`;

console.log('Testing URL:', testFullRecipe);

https.get(testFullRecipe, (res) => {
  console.log('Status code:', res.statusCode);
  console.log('Headers:', res.headers);
}).on('error', (e) => {
  console.error('Error:', e.message);
});
