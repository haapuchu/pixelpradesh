export interface RatioConfig {
  id: string;
  name: string;
  channel: string;
  aspect: string;
  aspectDecimal: number;
  width: number;
  height: number;
  badgeLabel: string;
  outpaintTransformation: string; // Cloudinary transformation
  safeZone: {
    topPercent: number;
    bottomPercent: number;
    leftPercent: number;
    rightPercent: number;
  };
}

export const SUPPORTED_RATIOS: Record<string, RatioConfig> = {
  "1_1": {
    id: "1_1",
    name: "Feed Square",
    channel: "Meta / Google Shopping / Catalog",
    aspect: "1:1",
    aspectDecimal: 1.0,
    width: 1080,
    height: 1080,
    badgeLabel: "1:1 Feed",
    outpaintTransformation: "c_pad,ar_1:1,b_gen_fill",
    safeZone: {
      topPercent: 12,
      bottomPercent: 18,
      leftPercent: 10,
      rightPercent: 10,
    },
  },

  "9_16": {
    id: "9_16",
    name: "Story & Reel",
    channel: "Instagram Story / Reels / YouTube Shorts",
    aspect: "9:16",
    aspectDecimal: 9 / 16,
    width: 1080,
    height: 1920,
    badgeLabel: "9:16 Story",
    outpaintTransformation: "c_pad,ar_9:16,b_gen_fill",
    safeZone: {
      topPercent: 20, // Account for top app bar
      bottomPercent: 25, // Account for bottom CTA & interactions
      leftPercent: 12,
      rightPercent: 12,
    },
  },

  "16_9": {
    id: "16_9",
    name: "Display Banner",
    channel: "Desktop Web / YouTube Banner / OTT",
    aspect: "16:9",
    aspectDecimal: 16 / 9,
    width: 1920,
    height: 1080,
    badgeLabel: "16:9 Banner",
    outpaintTransformation: "c_pad,ar_16:9,b_gen_fill",
    safeZone: {
      topPercent: 15,
      bottomPercent: 20,
      leftPercent: 8,
      rightPercent: 45, // Leave right side open for product placement
    },
  },
};

export const DEFAULT_RATIO_IDS = Object.keys(SUPPORTED_RATIOS);
