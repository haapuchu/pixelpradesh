import { SUPPORTED_LOCALES } from '@/config/locales.config';

export interface LocalizedCopy {
  localeId: string;
  language: string;
  festival: string;
  script: string;
  headline: string;
  cta: string;
  englishMeaning: string;
}

// Cultural copywriting engine with category-aware templates
export function generateLocalizedCopy(
  localeId: string,
  productName: string,
  category: string,
  userBrief?: string
): LocalizedCopy {
  const locale = SUPPORTED_LOCALES[localeId] || SUPPORTED_LOCALES.north_hindi;

  // Custom tailored variations based on category
  const isConfectionery = category.toLowerCase().includes('sweet') || category.toLowerCase().includes('confectionery');
  const isApparel = category.toLowerCase().includes('apparel') || category.toLowerCase().includes('kurta');
  const isBeverage = category.toLowerCase().includes('tea') || category.toLowerCase().includes('beverage');

  let headline = locale.sampleCopy.headline;
  let cta = locale.sampleCopy.cta;
  let englishMeaning = locale.sampleCopy.englishMeaning;

  if (userBrief && productName) {
    englishMeaning = `${englishMeaning} (${productName})`;
  }

  switch (locale.id) {
    case 'north_hindi':
      if (isConfectionery) {
        headline = "इस दिवाली, हर रिश्ते में घुले शुद्ध मिठास";
        cta = "त्योहारी डिब्बा मंगवाएं";
        englishMeaning = "This Diwali, dissolve pure sweetness in every relationship. Order Festive Box.";
      } else if (isApparel) {
        headline = "दिवाली के पावन पर्व पर, पारंपरिक शान";
        cta = "त्योहारी कलेक्शन देखें";
        englishMeaning = "On the auspicious occasion of Diwali, traditional elegance. View Festive Collection.";
      } else if (isBeverage) {
        headline = "दिवाली की सुबह, ताजगी और सुगंध की सौगात";
        cta = "प्रीमियम चाय खरीदें";
        englishMeaning = "Diwali morning, the gift of freshness and aroma. Buy Premium Tea.";
      }
      break;

    case 'east_bengali':
      if (isConfectionery) {
        headline = "পুজোর মিষ্টিমুখ, সেরা স্বাদের উপহার";
        cta = "মিষ্টির বাক্স কিনুন";
        englishMeaning = "Puja sweet feast, the gift of finest taste. Buy Sweets Box.";
      } else if (isApparel) {
        headline = "শারদীয়ার সাজে ফুটে উঠুক ঐতিহ্যের ছোঁয়া";
        cta = "নতুন কালেকশন দেখুন";
        englishMeaning = "May festive attire blossom with the touch of heritage. View New Collection.";
      } else if (isBeverage) {
        headline = "পুজোর আড্ডায় প্রতিটি চুমুকে খাঁটি আনন্দ";
        cta = "দার্জিলিং চা অর্ডার করুন";
        englishMeaning = "In Puja conversations, pure joy in every sip. Order Darjeeling Tea.";
      }
      break;

    case 'south_tamil':
      if (isConfectionery) {
        headline = "பொங்கல் திருநாளில் இனிக்கும் பாரம்பரிய சுவை";
        cta = "இனிப்பு பெட்டி வாங்குக";
        englishMeaning = "Sweet traditional taste on auspicious Pongal. Buy Sweet Box.";
      } else if (isApparel) {
        headline = "பொங்கல் திருநாளுக்கு பாரம்பரிய பட்டு ஆடை";
        cta = "ஆடை சேகரிப்பை பாருங்கள்";
        englishMeaning = "Traditional silk attire for the Pongal festival. View Attire Collection.";
      } else if (isBeverage) {
        headline = "தை பிறந்தால் வழி பிறக்கும், நறுமண தேநீர்";
        cta = "இப்போதே சுவைத்திடுங்கள்";
        englishMeaning = "With the dawn of Thai month comes prosperity and aromatic tea. Taste Now.";
      }
      break;

    case 'northeast_meitei':
      // Authentic Meitei Mayek Script copy for Ningol Chakouba & Lai Haraoba
      if (isConfectionery) {
        headline = "ꯅꯤꯉꯣꯜ ꯆꯥꯛꯀꯧꯕꯒꯤ ꯑꯊꯨꯝꯕ ꯄꯥꯎꯖꯦꯜ ꯑꯃꯁꯨꯡ ꯊꯧꯖꯥꯜ";
        cta = "ꯑꯊꯨꯝꯕ ꯄꯣꯠꯂꯝ ꯂꯧꯕꯤꯌꯨ";
        englishMeaning = "Sweet greetings and divine blessings for Ningol Chakouba feast. Order Sweets.";
      } else if (isApparel) {
        headline = "ꯆꯥꯛꯀꯧꯕ ꯊꯧꯔꯃꯗ ꯏꯅꯥꯛ ꯈꯨꯜꯂꯥꯞꯄ ꯐꯤꯖꯣꯜ";
        cta = "ꯐꯤꯔꯣꯜ ꯌꯦꯡꯕꯤꯌꯨ";
        englishMeaning = "Traditional festive attire for Chakouba celebrations. Browse Collection.";
      } else if (isBeverage) {
        headline = "ꯃꯅꯤꯄꯨꯔꯒꯤ ꯑꯀꯥꯡꯕ ꯆꯥꯍꯤꯒꯤ ꯃꯆꯦꯠ ꯆꯥ";
        cta = "ꯆꯥ ꯊꯛꯄꯤꯌꯨ";
        englishMeaning = "Aromatic tea moments for Ningol Chakouba gathering. Sip Fresh Tea.";
      }
      break;
  }

  return {
    localeId: locale.id,
    language: locale.language,
    festival: locale.festival,
    script: locale.script,
    headline,
    cta,
    englishMeaning,
  };
}
