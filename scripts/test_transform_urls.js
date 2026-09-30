const https = require('https');

function testUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      console.log('Status for', url.substring(0, 100) + '...', '=>', res.statusCode);
      resolve(res.statusCode);
    }).on('error', (e) => {
      console.log('Error for', url, '=>', e.message);
      resolve(500);
    });
  });
}

async function run() {
  const masterUrl = 'https://res.cloudinary.com/dcgug3wg/image/upload/v1790579048/adaptr_masters/kaju_katli_master.jpg';
  await testUrl(masterUrl);

  // Test simple format crop
  const cropped = 'https://res.cloudinary.com/dcgug3wg/image/upload/c_pad,w_1080,h_1080,b_gen_fill/v1790579048/adaptr_masters/kaju_katli_master.jpg';
  await testUrl(cropped);

  // Test simple resize
  const resize = 'https://res.cloudinary.com/dcgug3wg/image/upload/c_fill,w_800,h_800/v1790579048/adaptr_masters/kaju_katli_master.jpg';
  await testUrl(resize);

  // Test e_gen_background_replace
  const genBg = 'https://res.cloudinary.com/dcgug3wg/image/upload/e_gen_background_replace:prompt_festive%20Diwali%20marigold%20flowers/v1790579048/adaptr_masters/kaju_katli_master.jpg';
  await testUrl(genBg);
}

run();
