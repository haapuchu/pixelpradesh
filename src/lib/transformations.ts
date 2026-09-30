import type { LocaleConfig } from '@/config/locales.config';
import type { RatioConfig } from '@/config/ratios.config';

export interface TransformationRecipeOptions {
  cloudName?: string;
  publicId: string;
  locale: LocaleConfig;
  ratio: RatioConfig;
  headline: string;
  cta: string;
  stage?: string;
}

// Generates Cloudinary transformation segment strings
export const CloudinaryRecipes = {
  // Stage 1: Ingestion & Analysis
  analysis: () => 'fl_getinfo,colors_true,quality_analysis',

  // Stage 2: Scene localization via generative background replacement
  sceneLocalization: (locale: LocaleConfig) => {
    const cleanPrompt = locale.scenePrompt.replace(/,/g, ' ').replace(/\s+/g, ' ').trim();
    const prompt = encodeURIComponent(cleanPrompt);
    return `e_gen_background_replace:prompt_${prompt}`;
  },

  // Stage 2b: Prop replacement (e.g., adding festival-specific brass diya / dhunuchi / pongal pot)
  propReplacement: (locale: LocaleConfig) => {
    const from = encodeURIComponent(locale.propReplacePrompt.from.replace(/,/g, ' ').trim());
    const to = encodeURIComponent(locale.propReplacePrompt.to.replace(/,/g, ' ').trim());
    return `e_gen_replace:from_${from};to_${to}`;
  },

  // Stage 4: Channel fit via generative fill outpainting
  channelOutpaint: (ratio: RatioConfig) => {
    return `c_pad,ar_${ratio.aspect},b_gen_fill`;
  },

  // Stage 5: Indic Text Overlay (Headline & CTA)
  textOverlays: (locale: LocaleConfig, ratio: RatioConfig, headline: string, cta: string) => {
    // Standard system font supported for Unicode Indic rendering across Cloudinary environments
    const fontName = 'arial';
    const headlineSize = ratio.id === '9_16' ? 48 : ratio.id === '16_9' ? 38 : 34;
    const ctaSize = Math.round(headlineSize * 0.55);

    // Safe zone offsets based on ratio
    const headlineY = ratio.id === '9_16' ? 180 : 80;
    const ctaY = ratio.id === '9_16' ? 260 : 140;

    // Sanitize commas to prevent breaking Cloudinary URL transformation parameter parsing
    const cleanHeadline = encodeURIComponent(headline.replace(/,/g, ''));
    const cleanCta = encodeURIComponent(cta.replace(/,/g, ''));
    const accentHex = locale.accentColor.replace('#', '');

    // Headline layer
    const headlineLayer = `l_text:${fontName}_${headlineSize}_bold:${cleanHeadline},co_rgb:ffffff,g_north,y_${headlineY}`;
    // CTA button badge layer (clean syntax without invalid pa parameter)
    const ctaLayer = `l_text:${fontName}_${ctaSize}_bold:${cleanCta},co_rgb:${accentHex},g_north,y_${ctaY},b_rgb:111827,r_12`;

    return `${headlineLayer}/${ctaLayer}`;
  },

  // Edge delivery
  edgeOptimization: () => 'f_auto,q_auto',
};

// Assembles the complete deterministic Cloudinary URL Recipe
export function generateCloudinaryUrl(options: TransformationRecipeOptions): string {
  const cloudName = options.cloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dcgug3wg';
  const { publicId, locale, ratio, headline, cta } = options;

  const scene = CloudinaryRecipes.sceneLocalization(locale);
  const outpaint = CloudinaryRecipes.channelOutpaint(ratio);
  const text = CloudinaryRecipes.textOverlays(locale, ratio, headline, cta);
  const edge = CloudinaryRecipes.edgeOptimization();

  // Full chained recipe string
  const recipeChain = `${scene}/${outpaint}/${text}/${edge}`;
  const cleanId = publicId.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  return `https://res.cloudinary.com/${cloudName}/image/upload/${recipeChain}/${cleanId}.jpg`;
}

// Produces step-by-step intermediate transformation URLs for the Execution Inspector
export function generateStageUrls(options: TransformationRecipeOptions): {
  stage: string;
  name: string;
  url: string;
  recipeSegment: string;
}[] {
  const cloudName = options.cloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dcgug3wg';
  const { publicId, locale, ratio, headline, cta } = options;

  const base = `https://res.cloudinary.com/${cloudName}/image/upload`;
  const sceneSeg = CloudinaryRecipes.sceneLocalization(locale);
  const outpaintSeg = CloudinaryRecipes.channelOutpaint(ratio);
  const textSeg = CloudinaryRecipes.textOverlays(locale, ratio, headline, cta);
  const cleanId = publicId.replace(/\.(jpg|jpeg|png|webp)$/i, '');

  return [
    {
      stage: 'ANALYZING',
      name: 'Master Analysis & Bounding Box',
      url: `${base}/f_auto,q_auto/${cleanId}.jpg`,
      recipeSegment: 'fl_getinfo,colors_true,quality_analysis',
    },
    {
      stage: 'SCENE_LOCALIZATION',
      name: `Generative Scene (${locale.festival})`,
      url: `${base}/${sceneSeg}/f_auto,q_auto/${cleanId}.jpg`,
      recipeSegment: sceneSeg,
    },
    {
      stage: 'CANVAS_FORMAT',
      name: `Generative Outpaint (${ratio.aspect})`,
      url: `${base}/${sceneSeg}/${outpaintSeg}/f_auto,q_auto/${cleanId}.jpg`,
      recipeSegment: outpaintSeg,
    },
    {
      stage: 'TEXT_OVERLAY',
      name: `Indic Script Overlay (${locale.script})`,
      url: `${base}/${sceneSeg}/${outpaintSeg}/${textSeg}/f_auto,q_auto/${cleanId}.jpg`,
      recipeSegment: textSeg,
    },
    {
      stage: 'INDEXED',
      name: 'Cloudinary Delivery & Search Indexed',
      url: `${base}/${sceneSeg}/${outpaintSeg}/${textSeg}/f_auto,q_auto/${cleanId}.jpg`,
      recipeSegment: 'f_auto,q_auto (metadata: indexed)',
    },
  ];
}

// Deterministic Master Product Fallback URL generator (guaranteed to preserve master product)
export function getMasterProductAdaptedUrl(
  publicId: string,
  ratioAspect: string,
  cloudName = 'dcgug3wg'
): string {
  const cleanId = publicId.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  return `https://res.cloudinary.com/${cloudName}/image/upload/c_pad,ar_${ratioAspect},b_gen_fill/f_auto,q_auto/${cleanId}.jpg`;
}

// Maps product and variant IDs directly to pre-generated high-fidelity local assets in public/images/
export function getLocalVariantUrl(
  publicIdOrName: string,
  localeId: string,
  ratioId: string,
  productName?: string
): string {
  const combined = `${publicIdOrName || ''} ${productName || ''}`.toLowerCase();
  let folder = 'kaju';
  let prefix = 'kaju';

  if (
    combined.includes('kurta') ||
    combined.includes('silk') ||
    combined.includes('tussar') ||
    combined.includes('fabindia') ||
    combined.includes('apparel')
  ) {
    folder = 'kurta';
    prefix = 'kurta';
  } else if (
    combined.includes('tea') ||
    combined.includes('assam') ||
    combined.includes('makaibari') ||
    combined.includes('darjeeling') ||
    combined.includes('tin') ||
    combined.includes('beverage')
  ) {
    folder = 'tea';
    prefix = 'tea';
  }

  return `/images/${folder}/${prefix} ${localeId}_${ratioId}.png`;
}

