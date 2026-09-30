export interface LocaleConfig {
  id: string;
  name: string;
  region: string;
  language: string;
  script: string;
  festival: string;
  festivalSeason: string;
  fontName: string;
  fontUrlFallback?: string;
  accentColor: string;
  badgeBg: string;
  scenePrompt: string;
  propReplacePrompt: {
    from: string;
    to: string;
  };
  sampleCopy: {
    headline: string;
    cta: string;
    englishMeaning: string;
  };
  brandSafetyKeywords: string[];
}

export const SUPPORTED_LOCALES: Record<string, LocaleConfig> = {
  north_hindi: {
    id: "north_hindi",
    name: "Hindi / North & West",
    region: "North India",
    language: "Hindi",
    script: "Devanagari",
    festival: "Diwali",
    festivalSeason: "Deepavali Festive",
    fontName: "Noto Sans Devanagari",
    accentColor: "#f59e0b", // Gold / Amber
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    scenePrompt: "warm festive Diwali ambiance, glowing brass diyas, delicate marigold flower garlands, royal ornate backdrop, soft bokeh festive lights",
    propReplacePrompt: {
      from: "background prop",
      to: "ornate brass diya with soft golden flame and scattered marigold petals",
    },
    sampleCopy: {
      headline: "इस दिवाली मिठास अपनों के साथ",
      cta: "अभी ऑर्डर करें",
      englishMeaning: "This Diwali sweetness with loved ones. Order Now.",
    },
    brandSafetyKeywords: ["जुआ", "पटाखे", "सट्टा"],
  },

  east_bengali: {
    id: "east_bengali",
    name: "Bengali / West Bengal & East",
    region: "East India",
    language: "Bengali",
    script: "Bengali",
    festival: "Durga Puja",
    festivalSeason: "Sharodotsav",
    fontName: "Noto Sans Bengali",
    accentColor: "#dc2626", // Crimson Red
    badgeBg: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    scenePrompt: "autumn Durga Puja aesthetic, white Kash phool reeds, red and ivory silk drape accents, traditional terracotta Dhunuchi incense burner with fragrant white smoke, festive pandal lighting",
    propReplacePrompt: {
      from: "background prop",
      to: "traditional terracotta dhunuchi with subtle white fragrant smoke curls",
    },
    sampleCopy: {
      headline: "পুজোর আনন্দে সাজুক প্রতিটি মুহূর্ত",
      cta: "এখনই কিনুন",
      englishMeaning: "May every moment shine with the joy of Puja. Buy Now.",
    },
    brandSafetyKeywords: ["বিবাদ", "অশান্তি"],
  },

  south_tamil: {
    id: "south_tamil",
    name: "Tamil / Tamil Nadu",
    region: "South India",
    language: "Tamil",
    script: "Tamil",
    festival: "Pongal",
    festivalSeason: "Harvest Festival",
    fontName: "Noto Sans Tamil",
    accentColor: "#16a34a", // Banana Leaf Green & Turmeric
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    scenePrompt: "traditional Tamil Pongal harvest dawn, fresh green plantain banana leaf, raw sugarcane stalks, traditional mud pot overflowing with harvest rice, brass vilakku lamp",
    propReplacePrompt: {
      from: "background prop",
      to: "traditional earthen Pongal pot with turmeric leaf sprigs and sugarcane stalk",
    },
    sampleCopy: {
      headline: "பொங்கல் திருநாள் இனிமை உங்கள் இல்லத்தில்",
      cta: "இப்போதே வாங்குங்கள்",
      englishMeaning: "The sweetness of Pongal festival in your home. Buy Now.",
    },
    brandSafetyKeywords: ["கலவரம்", "சூதாட்டம்"],
  },

  northeast_meitei: {
    id: "northeast_meitei",
    name: "Meitei / Manipur",
    region: "Northeast India",
    language: "Manipuri (Meiteilon)",
    script: "Meetei Mayek",
    festival: "Ningol Chakouba",
    festivalSeason: "Chakouba Feast",
    fontName: "Noto Sans Meetei Mayek",
    accentColor: "#ec4899", // Lotus Pink & Moirang Phee
    badgeBg: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    scenePrompt: "elegant Ningol Chakouba festive setting, traditional Manipuri handwoven Moirang Phee fabric border, bell-metal plates, fresh lotus petals, gentle morning sunlight",
    propReplacePrompt: {
      from: "background prop",
      to: "traditional Manipuri bell-metal dish with fresh pink lotus blossom",
    },
    sampleCopy: {
      headline: "ꯅꯤꯉꯣꯜ ꯆꯥꯛꯀꯧꯕꯒꯤ ꯌꯥꯏꯐ-ꯄꯥꯎꯖꯦꯜ",
      cta: "ꯍꯧꯖꯤꯛ ꯂꯧꯕꯤꯌꯨ",
      englishMeaning: "Heartfelt blessings for Ningol Chakouba. Get It Now.",
    },
    brandSafetyKeywords: ["খৎ-খৎ", "লান"],
  },
};

export const DEFAULT_LOCALE_IDS = Object.keys(SUPPORTED_LOCALES);
