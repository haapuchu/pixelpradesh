'use client';

import React, { useEffect, useState } from 'react';
import { AdVariant } from '@/types/job';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import {
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  SlidersHorizontal,
  Wand2,
  Smartphone,
  Share2,
  Heart,
  MessageCircle,
  Bookmark,
  Music,
  Sparkles,
  Layers,
  Eye,
  Sliders,
  ShieldCheck,
  Volume2,
  Play,
  Tv,
  BadgeCheck,
} from 'lucide-react';

interface StudioLightboxProps {
  variant: AdVariant | null;
  allVariants: AdVariant[];
  masterUrl: string;
  onClose: () => void;
  onSelectVariant: (v: AdVariant) => void;
  onRegenerate: (variantId: string) => Promise<void>;
}

export type PreviewMode = 'creative' | 'slider' | 'social';

export const StudioLightbox: React.FC<StudioLightboxProps> = ({
  variant,
  allVariants,
  masterUrl,
  onClose,
  onSelectVariant,
  onRegenerate,
}) => {
  const [copiedRecipe, setCopiedRecipe] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Preview Mode: 'creative' (pure creative) | 'slider' (before/after) | 'social' (channel UI simulation)
  const [previewMode, setPreviewMode] = useState<PreviewMode>('creative');
  const [showSafeZoneGuides, setShowSafeZoneGuides] = useState(true);

  // Interactive like state for simulated social UI
  const [hasLiked, setHasLiked] = useState(false);

  // QoL Feature: Refine Creative / Reiteration Modal State
  const [isRefiningOpen, setIsRefiningOpen] = useState(false);
  const [refinePrompt, setRefinePrompt] = useState('');
  const [isSimulatingRefine, setIsSimulatingRefine] = useState(false);
  const [refineIteration, setRefineIteration] = useState<Record<string, number>>({});
  const [refineSuccessMsg, setRefineSuccessMsg] = useState<string | null>(null);

  // Reset liked state when variant changes
  useEffect(() => {
    setHasLiked(false);
  }, [variant?.id]);

  // Keyboard navigation: Escape, ArrowLeft, ArrowRight
  useEffect(() => {
    if (!variant) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isRefiningOpen) {
          setIsRefiningOpen(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowLeft' && !isRefiningOpen) {
        const currentIndex = allVariants.findIndex((v) => v.id === variant.id);
        if (currentIndex > 0) {
          onSelectVariant(allVariants[currentIndex - 1]);
        }
      } else if (e.key === 'ArrowRight' && !isRefiningOpen) {
        const currentIndex = allVariants.findIndex((v) => v.id === variant.id);
        if (currentIndex < allVariants.length - 1) {
          onSelectVariant(allVariants[currentIndex + 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [variant, allVariants, onClose, onSelectVariant, isRefiningOpen]);

  if (!variant) return null;

  const currentIndex = allVariants.findIndex((v) => v.id === variant.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allVariants.length - 1;
  const isFlagged = variant.status === 'FLAGGED';
  const currentIteration = refineIteration[variant.id] || 1;

  const is9_16 = variant.ratioId === '9_16' || variant.metadata?.ratio === '9:16';
  const is16_9 = variant.ratioId === '16_9' || variant.metadata?.ratio === '16:9';
  const is1_1 = !is9_16 && !is16_9;

  // Region, script and language mapping helper
  const getLocaleMeta = (localeId: string) => {
    if (localeId.includes('hindi')) {
      return {
        lang: 'Hindi',
        region: 'North & West',
        scriptSample: 'शुभ दीपावली',
        fontClass: 'font-devanagari',
        scriptName: 'Devanagari',
        channelLabel: 'Meta & Google Shopping (North)',
        platformLabel: is16_9
          ? 'YouTube & Google Video Flight'
          : is9_16
          ? 'Instagram Reels & Stories'
          : 'Meta & Google Shopping Feed',
        socialCaption: `शुभ दीपावली! ✨ Celebrate timeless festive moments with exquisite taste and tradition. Handcrafted for unforgettable gifting and joyous family gatherings.\n\n#Diwali2026 #PixelPradesh #FestiveGifting #DeepavaliCelebration #ArtisanalIndia`,
      };
    }
    if (localeId.includes('bengali')) {
      return {
        lang: 'Bengali',
        region: 'Bengal · East',
        scriptSample: 'শুভ শারদীয়া',
        fontClass: 'font-bengali',
        scriptName: 'Bengali',
        channelLabel: 'Meta & OTT Display (Bengal)',
        platformLabel: is16_9
          ? 'Hotstar & Regional OTT Flight'
          : is9_16
          ? 'Instagram Reels & Stories'
          : 'Meta Feed & Regional Carousel',
        socialCaption: `শুভ শারদীয়া! 🌸 Bring home the warmth, sweetness, and blessings of Durga Puja with our artisanal collection. Crafted with pure devotion for joyous celebrations.\n\n#DurgaPuja2026 #ShubhoSharadiya #PujoVibes #PixelPradesh #BengalFestive`,
      };
    }
    if (localeId.includes('tamil')) {
      return {
        lang: 'Tamil',
        region: 'Tamil Nadu · South',
        scriptSample: 'இனிய பொங்கல்',
        fontClass: 'font-tamil',
        scriptName: 'Tamil',
        channelLabel: 'Meta Feed & OTT (Tamil Nadu)',
        platformLabel: is16_9
          ? 'Sun NXT & YouTube Video Ad'
          : is9_16
          ? 'Instagram Reels & Stories'
          : 'Meta Feed & Local Showcase',
        socialCaption: `இனிய பொங்கல் திருநாள் நல்வாழ்த்துகள்! 🌾 Celebrate the bounty of harvest with golden authenticity and festive heritage. Best wishes for prosperity and health.\n\n#Pongal2026 #IniyaPongal #TamilHeritage #PixelPradesh #HarvestFestival`,
      };
    }
    return {
      lang: 'Meitei',
      region: 'Manipur',
      scriptSample: 'ꯅꯤꯉꯣꯜ ꯆꯥꯛꯀꯧꯕ',
      fontClass: 'font-meetei',
      scriptName: 'Meitei Mayek',
      channelLabel: 'Reels & Regional OTT (Manipur)',
      platformLabel: is16_9
        ? 'Connected TV & Regional OTT'
        : is9_16
        ? 'Instagram Reels & Stories'
        : 'Meta Feed & Community Ad',
      socialCaption: `ꯅꯤꯉꯣꯜ ꯆꯥꯛꯀꯧꯕ ꯌꯥꯏꯐꯔꯦ! 🌺 Honoring the eternal bond of family, love, and togetherness during this auspicious celebration.\n\n#NingolChakouba #Manipur #PixelPradesh #NortheastCulture #FestiveIndia`,
    };
  };

  const localeMeta = getLocaleMeta(variant.localeId);

  const getFormatLabel = () => {
    if (is9_16) return '9:16 Stories & Reels';
    if (is16_9) return '16:9 Display Banner';
    return '1:1 Social Feed';
  };

  const getFormatDimensions = () => {
    if (is9_16) return '1080 × 1920';
    if (is16_9) return '1920 × 1080';
    return '1080 × 1080';
  };

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      // Fallback
    }
  };

  const handleCopyRecipe = () => {
    copyToClipboard(variant.recipeUrl);
    setCopiedRecipe(true);
    setTimeout(() => setCopiedRecipe(false), 2000);
  };

  const handleCopySocialCaption = () => {
    copyToClipboard(localeMeta.socialCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleRegenerateClick = async () => {
    setIsRegenerating(true);
    try {
      await onRegenerate(variant.id);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleRefineSubmit = () => {
    if (!refinePrompt.trim()) return;
    setIsSimulatingRefine(true);
    setTimeout(() => {
      setIsSimulatingRefine(false);
      setRefineIteration((prev) => ({
        ...prev,
        [variant.id]: (prev[variant.id] || 1) + 1,
      }));
      setRefineSuccessMsg(
        `Iteration #${(refineIteration[variant.id] || 1) + 1} generated with custom directives.`
      );
      setIsRefiningOpen(false);
      setRefinePrompt('');
      setTimeout(() => setRefineSuccessMsg(null), 4000);
    }, 1200);
  };

  const suggestionPills = [
    'Warm Golden Ambient Light',
    'Minimalist Cultural Backdrop',
    'Higher Subject Contrast',
    'Festive Sparkle & Diyas',
    'Lower Indic Headline Safe Margin',
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${variant.metadata.festival} Creative Review Studio`}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Lightbox Modal Shell: Full natural flow on mobile/tablet, side-by-side on desktop */}
      <div className="relative flex flex-col lg:flex-row w-full max-w-5xl xl:max-w-6xl max-h-[95vh] lg:max-h-[92vh] overflow-y-auto lg:overflow-hidden rounded-2xl border border-stone-800 bg-[#121110] text-stone-200 shadow-2xl">
        
        {/* Mobile/Tablet Quick Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close review studio"
          className="lg:hidden absolute top-3 right-3 z-40 rounded-full p-2 bg-stone-900/90 border border-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer shadow-md"
        >
          <X className="h-4 w-4" />
        </button>

        {/* LEFT COLUMN: Visual Review Studio Canvas & Filmstrip */}
        <div className="relative w-full lg:flex-1 flex flex-col justify-between bg-[#0c0a09] p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-stone-800/80 shrink-0 lg:shrink lg:overflow-y-auto">
          
          {/* Header Bar with Mode Selector & Safe Zone Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-stone-800/80 pr-10 lg:pr-0">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-display text-base sm:text-lg font-bold text-white tracking-tight">
                  {variant.metadata.festival}
                </span>
                <span className="rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[11px] font-mono font-medium text-amber-400">
                  {variant.metadata.ratio || (is9_16 ? '9:16' : is16_9 ? '16:9' : '1:1')}
                </span>
                {currentIteration > 1 && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                    <Sparkles className="h-2.5 w-2.5" />
                    v{currentIteration}.0 Refined
                  </span>
                )}
                <span className="text-xs text-stone-400">
                  · {localeMeta.lang} / {localeMeta.region}
                </span>
              </div>
              <p className={`text-xs sm:text-sm text-stone-300 font-medium ${localeMeta.fontClass}`}>
                {localeMeta.scriptSample}
              </p>
            </div>

            {/* Segmented Mode Switch: Creative / Compare / Channel UI */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <div className="flex items-center rounded-xl bg-stone-900 border border-stone-800 p-0.5 shadow-inner">
                <button
                  type="button"
                  onClick={() => setPreviewMode('creative')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    previewMode === 'creative'
                      ? 'bg-white text-stone-950 shadow-xs'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Creative
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('slider')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    previewMode === 'slider'
                      ? 'bg-white text-stone-950 shadow-xs'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Compare
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('social')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    previewMode === 'social'
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                      : 'text-amber-400/90 hover:text-amber-300'
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>Channel UI</span>
                </button>
              </div>

              {previewMode === 'social' && (
                <button
                  type="button"
                  onClick={() => setShowSafeZoneGuides((prev) => !prev)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono border transition-all cursor-pointer ${
                    showSafeZoneGuides
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-xs'
                      : 'bg-stone-900 text-stone-500 border-stone-800 hover:text-stone-300'
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                  <span>{showSafeZoneGuides ? 'Safe zone: ON' : 'Safe zone: OFF'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Canvas Centerpiece */}
          <div className="relative flex-1 flex items-center justify-center my-auto min-h-[280px] sm:min-h-[340px] p-1 sm:p-2">
            {/* Prev / Next Arrows */}
            <button
              type="button"
              onClick={() => hasPrev && onSelectVariant(allVariants[currentIndex - 1])}
              disabled={!hasPrev}
              aria-label="Previous creative"
              className={`absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-stone-900/90 border border-stone-700/80 text-white transition-all shadow-md ${
                hasPrev
                  ? 'hover:bg-stone-800 hover:scale-105 cursor-pointer'
                  : 'opacity-20 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => hasNext && onSelectVariant(allVariants[currentIndex + 1])}
              disabled={!hasNext}
              aria-label="Next creative"
              className={`absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-stone-900/90 border border-stone-700/80 text-white transition-all shadow-md ${
                hasNext
                  ? 'hover:bg-stone-800 hover:scale-105 cursor-pointer'
                  : 'opacity-20 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* VIEW MODE 1: PURE CREATIVE VIEW (Default, uncropped, razor-sharp) */}
            {previewMode === 'creative' && (
              <div
                className={`relative flex items-center justify-center rounded-2xl overflow-hidden border border-stone-800/80 bg-[#090807] shadow-2xl p-1 ${
                  is9_16
                    ? 'aspect-[9/16] h-[46vh] sm:h-[52vh] max-h-[480px] w-auto mx-auto'
                    : is16_9
                    ? 'aspect-[16/9] w-full max-w-2xl mx-auto'
                    : 'aspect-square w-full max-w-[380px] mx-auto'
                }`}
              >
                <img
                  src={variant.finalUrl || masterUrl}
                  alt={variant.metadata.festival}
                  className="h-full w-full object-contain rounded-xl select-none"
                />
                <div className="absolute bottom-3 left-3 rounded-lg bg-black/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono text-stone-300 border border-white/10 flex items-center gap-1.5 shadow-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  <span>{getFormatLabel()} ({getFormatDimensions()})</span>
                </div>
              </div>
            )}

            {/* VIEW MODE 2: BEFORE / AFTER SPLIT COMPARISON SLIDER */}
            {previewMode === 'slider' && (
              <div className="w-full flex items-center justify-center">
                <BeforeAfterSlider
                  masterUrl={masterUrl}
                  variantUrl={variant.finalUrl}
                  masterLabel="Master asset"
                  variantLabel="Localized creative"
                  ratio={variant.metadata.ratio || variant.ratioId}
                />
              </div>
            )}

            {/* VIEW MODE 3: SOCIAL / CHANNEL UI SIMULATION (Tailored for 9:16, 1:1, 16:9) */}
            {previewMode === 'social' && (
              <div className="w-full flex items-center justify-center">
                
                {/* 1. STORIES & REELS (9:16) */}
                {is9_16 && (
                  <div className="relative aspect-[9/16] h-[46vh] sm:h-[52vh] max-h-[490px] w-auto rounded-[32px] overflow-hidden border-2 border-stone-700 bg-black shadow-2xl flex flex-col justify-between p-3 select-none font-sans">
                    {/* Underlying Creative Image */}
                    <img
                      src={variant.finalUrl || masterUrl}
                      alt={variant.metadata.festival}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    {/* Atmospheric Vignette Gradients for readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

                    {/* Dotted Safe Margin Guide */}
                    {showSafeZoneGuides && (
                      <div className="absolute inset-x-3.5 top-11 bottom-18 border-2 border-dashed border-amber-400/60 rounded-2xl pointer-events-none flex items-start justify-end p-1.5 z-20">
                        <span className="rounded-md bg-black/85 backdrop-blur-md px-1.5 py-0.5 text-[9px] font-mono text-amber-300 border border-amber-400/40 shadow-sm">
                          9:16 Meta Reels Safe Zone ✓
                        </span>
                      </div>
                    )}

                    {/* Story Header */}
                    <div className="relative z-10 space-y-2 drop-shadow-md">
                      <div className="flex gap-1 pt-1">
                        <div className="h-0.5 flex-1 bg-white rounded-full"></div>
                        <div className="h-0.5 flex-1 bg-white/40 rounded-full"></div>
                        <div className="h-0.5 flex-1 bg-white/40 rounded-full"></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5">
                            <div className="h-full w-full rounded-full bg-stone-900 flex items-center justify-center text-[10px] font-bold text-white">
                              P
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-[11px] leading-tight text-white flex items-center gap-1">
                              <span>pixelpradesh</span>
                              <BadgeCheck className="h-3 w-3 text-sky-400 fill-sky-400" />
                              <span className="text-white/70 text-[9px]">· Sponsored</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-white/80">
                          <Volume2 className="h-3.5 w-3.5" />
                          <span className="text-xs font-bold">✕</span>
                        </div>
                      </div>
                    </div>

                    {/* Right-Side Reels Engagement Stack */}
                    <div className="absolute right-3 bottom-20 z-10 flex flex-col items-center gap-3 drop-shadow-md text-white">
                      <button
                        type="button"
                        onClick={() => setHasLiked((prev) => !prev)}
                        className="flex flex-col items-center cursor-pointer transition-transform active:scale-125"
                      >
                        <Heart
                          className={`h-5 w-5 transition-colors ${
                            hasLiked ? 'fill-rose-500 text-rose-500' : 'text-white'
                          }`}
                        />
                        <span className="text-[9px] font-bold mt-0.5">
                          {hasLiked ? '24.9K' : '24.8K'}
                        </span>
                      </button>
                      <div className="flex flex-col items-center">
                        <MessageCircle className="h-5 w-5" />
                        <span className="text-[9px] font-bold mt-0.5">582</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Share2 className="h-5 w-5" />
                        <span className="text-[9px] font-bold mt-0.5">1.8K</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Bookmark className="h-5 w-5" />
                      </div>
                    </div>

                    {/* Story Bottom CTA & Indic Audio Bar */}
                    <div className="relative z-10 space-y-1.5 drop-shadow-md pr-12">
                      <a
                        href={variant.finalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between w-full bg-white hover:bg-stone-100 text-stone-950 font-bold px-3.5 py-2 rounded-xl shadow-lg transition-colors"
                      >
                        <span className="text-xs truncate">
                          {variant.metadata.cta || 'Shop Festive Look'}
                        </span>
                        <ChevronRight className="h-4 w-4 shrink-0" />
                      </a>
                      <div className="flex items-center gap-1.5 text-[10px] text-white/90 truncate">
                        <Music className="h-3 w-3 shrink-0 text-amber-300" />
                        <span className="truncate">{localeMeta.scriptSample} · Original Festive Audio</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. FEED POST (1:1) */}
                {is1_1 && (
                  <div className="relative aspect-square w-full max-w-[380px] rounded-2xl overflow-hidden border border-stone-800 bg-[#0f0e0d] shadow-2xl flex flex-col justify-between select-none font-sans">
                    {/* Feed Top Header */}
                    <div className="relative z-10 flex items-center justify-between bg-stone-950/90 backdrop-blur-md px-3.5 py-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5">
                          <div className="h-full w-full rounded-full bg-stone-900 flex items-center justify-center text-[10px] font-bold text-white">
                            P
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-xs text-white leading-tight flex items-center gap-1">
                            <span>pixelpradesh.official</span>
                            <BadgeCheck className="h-3 w-3 text-sky-400 fill-sky-400" />
                          </div>
                          <div className="text-[10px] text-stone-400 leading-tight">
                            Sponsored · {variant.metadata.festival}
                          </div>
                        </div>
                      </div>
                      <span className="text-stone-400 text-sm">•••</span>
                    </div>

                    {/* Creative Image Stage */}
                    <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
                      <img
                        src={variant.finalUrl || masterUrl}
                        alt={variant.metadata.festival}
                        className="h-full w-full object-contain"
                      />
                      {showSafeZoneGuides && (
                        <div className="absolute inset-4 border border-dashed border-amber-400/60 rounded-lg pointer-events-none flex items-start justify-end p-1 z-20">
                          <span className="rounded bg-black/85 backdrop-blur-md px-1.5 py-0.5 text-[9px] font-mono text-amber-300 border border-amber-400/40 shadow-sm">
                            Feed 1080×1080 Safe Margin ✓
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Feed Engagement & Caption Footer */}
                    <div className="relative z-10 bg-stone-950/95 backdrop-blur-md p-3 border-t border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setHasLiked((prev) => !prev)}
                            className="cursor-pointer transition-transform active:scale-125"
                          >
                            <Heart
                              className={`h-4.5 w-4.5 transition-colors ${
                                hasLiked ? 'fill-rose-500 text-rose-500' : 'text-white'
                              }`}
                            />
                          </button>
                          <MessageCircle className="h-4.5 w-4.5" />
                          <Share2 className="h-4.5 w-4.5" />
                        </div>
                        <Bookmark className="h-4.5 w-4.5" />
                      </div>
                      <div className="text-[11px] text-stone-400">
                        Liked by <span className="font-semibold text-stone-200">artisanal_india</span> and{' '}
                        <span className="font-semibold text-stone-200">{hasLiked ? '4,893 others' : '4,892 others'}</span>
                      </div>
                      <div className="text-[11px] text-stone-300 leading-snug line-clamp-2">
                        <span className="font-bold text-white mr-1.5">pixelpradesh.official</span>
                        <span className={`${localeMeta.fontClass} mr-1 font-semibold text-amber-300`}>
                          {localeMeta.scriptSample}
                        </span>
                        <span>{variant.metadata.headline}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. DISPLAY BANNER / OTT (16:9) */}
                {is16_9 && (
                  <div className="relative aspect-[16/9] w-full max-w-2xl rounded-2xl overflow-hidden border border-stone-800 bg-[#0a0908] shadow-2xl flex flex-col justify-between p-3 sm:p-4 select-none font-sans">
                    {/* Underlying Creative Image */}
                    <img
                      src={variant.finalUrl || masterUrl}
                      alt={variant.metadata.festival}
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                    {/* Atmospheric top and bottom gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/75 pointer-events-none" />

                    {/* Safe Margin Boundary Guides */}
                    {showSafeZoneGuides && (
                      <div className="absolute inset-x-6 inset-y-4 border-2 border-dashed border-amber-400/50 rounded-xl pointer-events-none flex items-start justify-end p-2 z-20">
                        <span className="rounded-md bg-black/85 backdrop-blur-md px-2 py-0.5 text-[9px] font-mono text-amber-300 border border-amber-400/40 shadow-sm">
                          OTT 16:9 Display Safe Zone ✓
                        </span>
                      </div>
                    )}

                    {/* Top Ad Badge */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-amber-500 text-stone-950 font-bold text-[10px] px-2 py-0.5 shadow-sm">
                          Ad · 0:15
                        </span>
                        <span className="text-xs font-semibold text-white drop-shadow-sm flex items-center gap-1">
                          <span>{localeMeta.platformLabel}</span>
                        </span>
                      </div>
                      <span className="rounded-lg bg-black/70 backdrop-blur-md px-2.5 py-1 text-[10.5px] font-medium text-stone-300 border border-white/10 shadow-sm">
                        Sponsored Web Display
                      </span>
                    </div>

                    {/* Bottom In-Stream CTA Overlay with Integrated Scrubber */}
                    <div className="relative z-10 space-y-2">
                      {/* Video Scrubber Line docked above banner */}
                      <div className="flex items-center gap-2 px-0.5">
                        <div className="h-1 flex-1 bg-white/25 rounded-full overflow-hidden">
                          <div className="h-full w-3/5 bg-amber-500 rounded-full"></div>
                        </div>
                        <span className="text-[9px] font-mono text-white/80">0:09 / 0:15</span>
                      </div>

                      {/* Frosted In-Stream CTA Card */}
                      <div className="flex items-center justify-between gap-3 bg-black/85 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-white/15 shadow-xl">
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-bold text-amber-300 ${localeMeta.fontClass}`}>
                              {localeMeta.scriptSample}
                            </span>
                            <span className="text-[10px] text-stone-400">· 4.9 ★ (2,840)</span>
                          </div>
                          <p className="text-xs font-semibold text-white truncate">
                            {variant.metadata.headline}
                          </p>
                        </div>

                        <a
                          href={variant.finalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-3.5 py-2 text-xs transition-colors shadow-lg flex items-center gap-1.5 shrink-0 cursor-pointer"
                        >
                          <span>Visit Store</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Filmstrip Carousel of all 12 creatives */}
          <div className="mt-3 pt-3 border-t border-stone-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-stone-400">
                {currentIndex + 1} of {allVariants.length} · Click thumbnail to jump
              </span>
              <span className="text-[11px] text-stone-400 font-medium">
                Format: <span className="text-stone-200">{getFormatLabel()}</span>
              </span>
            </div>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
              {allVariants.map((v) => {
                const isActive = v.id === variant.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => onSelectVariant(v)}
                    className={`relative h-13 w-13 rounded-xl overflow-hidden shrink-0 border transition-all cursor-pointer bg-stone-900 ${
                      isActive
                        ? 'ring-2 ring-amber-500 border-amber-400 shadow-md scale-105 z-10'
                        : 'border-stone-800/90 opacity-70 hover:opacity-100 hover:border-stone-600'
                    }`}
                  >
                    <img
                      src={v.finalUrl || masterUrl}
                      alt={v.metadata.festival}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = masterUrl;
                      }}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 rounded-tl bg-black/80 px-1 py-0.2 text-[8px] font-mono text-white/90">
                      {v.metadata.ratio}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Focused Creative Review Inspector */}
        <div className="w-full lg:w-[380px] xl:w-[410px] flex flex-col justify-between bg-[#141312] p-4 sm:p-6 overflow-hidden shrink-0">
          <div className="space-y-4 overflow-y-auto pr-1">
            
            {/* Top Inspector Header with Close Button */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-display text-sm font-bold text-white tracking-tight">
                  Creative review studio
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close review studio"
                className="hidden lg:flex rounded-lg p-1.5 text-stone-400 hover:bg-stone-800 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Refinement Success Toast if active */}
            {refineSuccessMsg && (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{refineSuccessMsg}</span>
              </div>
            )}

            {/* Status Card */}
            <div className="rounded-xl border border-stone-800 bg-stone-900/70 p-3.5 flex items-start gap-3">
              {isFlagged ? (
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div className="min-w-0 flex-1">
                <div className="font-display text-xs font-bold text-white">
                  {isFlagged ? 'Needs review' : 'Campaign ready'}
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                  {isFlagged
                    ? 'Headline exceeds top display safe boundary. Auto-Align Safe Margins recommended.'
                    : 'This creative complies with brand safety, visual fidelity, and format safe margins.'}
                </p>
              </div>
            </div>

            {/* QoL Feature: Refine Creative Drawer (Request Modification) */}
            <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  <span>Creative iteration</span>
                </span>
                <span className="text-[10px] font-mono text-amber-400 font-semibold">
                  v{currentIteration}.0
                </span>
              </div>

              {!isRefiningOpen ? (
                <button
                  type="button"
                  onClick={() => setIsRefiningOpen(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 py-2 px-3 text-xs font-semibold text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
                >
                  <Wand2 className="h-3.5 w-3.5 text-amber-400" />
                  <span>Refine creative / modify prompt</span>
                </button>
              ) : (
                <div className="space-y-2.5 pt-1 border-t border-stone-800/80 animate-fadeIn">
                  <p className="text-[11px] text-stone-400">
                    Direct the autonomous localization engine to modify scene styling, lighting, or composition:
                  </p>

                  {/* Suggestion Pills */}
                  <div className="flex flex-wrap gap-1">
                    {suggestionPills.map((pill) => (
                      <button
                        key={pill}
                        type="button"
                        onClick={() => setRefinePrompt(pill)}
                        className="text-[10px] rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300 px-2 py-0.5 border border-stone-700 transition-colors cursor-pointer"
                      >
                        + {pill}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={2}
                    value={refinePrompt}
                    onChange={(e) => setRefinePrompt(e.target.value)}
                    placeholder="e.g. Enhance background marigold warmth, shift tea steam slightly right..."
                    className="w-full resize-none rounded-lg border border-stone-700 bg-black/50 p-2 text-xs text-white placeholder-stone-500 focus:border-amber-400 focus:outline-none"
                  />

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRefineSubmit}
                      disabled={isSimulatingRefine || !refinePrompt.trim()}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold py-2 text-xs transition-colors cursor-pointer"
                    >
                      {isSimulatingRefine ? (
                        <>
                          <RefreshCw className="h-3 w-3 animate-spin" />
                          <span>Reiterating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3 w-3" />
                          <span>Submit refinement</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsRefiningOpen(false)}
                      className="rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-xs text-stone-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Creative Details Section with Tactile Copy Button */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                Creative details
              </span>

              <div className="rounded-xl border border-stone-800/80 bg-stone-900/40 p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Market</span>
                  <span className="font-medium text-stone-200">{variant.metadata.festival}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Language</span>
                  <span className="font-medium text-stone-200">
                    {localeMeta.lang} ({localeMeta.scriptName})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Region</span>
                  <span className="font-medium text-stone-200">{localeMeta.region}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Format</span>
                  <span className="font-medium text-stone-200">{getFormatLabel()}</span>
                </div>
              </div>

              {/* Dedicated Copy Button */}
              <button
                type="button"
                onClick={handleCopySocialCaption}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-stone-700 bg-stone-900 hover:bg-stone-800 py-2 px-3 text-xs font-medium text-stone-200 hover:text-white transition-all shadow-xs cursor-pointer"
              >
                {copiedCaption ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copied caption & hashtags!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-amber-400" />
                    <span>Copy localized caption & tags</span>
                  </>
                )}
              </button>
            </div>

            {/* Review Checks Section */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                Review checks
              </span>
              <div className="rounded-xl border border-stone-800/80 bg-stone-900/40 p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-stone-300 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Product geometry</span>
                  </span>
                  <span className="text-[11px] font-medium text-stone-400">Maintained (SSIM 98%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-300 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Logo & emblem contrast</span>
                  </span>
                  <span className="text-[11px] font-medium text-stone-400">Passed (7.2:1)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-300 flex items-center gap-1.5">
                    {isFlagged ? (
                      <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    )}
                    <span>Safe-zone placement</span>
                  </span>
                  <span
                    className={`text-[11px] font-medium ${
                      isFlagged ? 'text-amber-400 font-semibold' : 'text-stone-400'
                    }`}
                  >
                    {isFlagged ? 'Near top border (14px)' : 'Within limits (32px pad)'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-300 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Cultural sensitivity</span>
                  </span>
                  <span className="text-[11px] font-medium text-stone-400">Appropriate</span>
                </div>
              </div>

              {/* Fix Layout Button if Flagged */}
              {isFlagged && (
                <button
                  type="button"
                  onClick={handleRegenerateClick}
                  disabled={isRegenerating}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 text-xs transition-colors disabled:opacity-50 cursor-pointer shadow-xs mt-2"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin' : ''}`}
                  />
                  <span>
                    {isRegenerating ? 'Auto-aligning safe margins...' : 'Auto-Align Safe Margins'}
                  </span>
                </button>
              )}
            </div>

            {/* Technical Details Accordion (Collapsed) */}
            <details className="group rounded-xl border border-stone-800 bg-stone-900/40 overflow-hidden">
              <summary className="flex items-center justify-between p-3 text-xs font-semibold text-stone-300 cursor-pointer select-none hover:bg-stone-800/40 transition-colors">
                <span className="flex items-center gap-1.5">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-amber-400" />
                  <span>Technical details</span>
                </span>
                <span className="text-[11px] text-stone-500 group-open:rotate-180 transition-transform">
                  ▾
                </span>
              </summary>

              <div className="p-3 pt-0 space-y-2.5 border-t border-stone-800/70">
                <div className="space-y-1 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-stone-500">
                      Cloudinary Transformation Recipe
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyRecipe}
                      className="flex items-center gap-1 text-[10px] font-semibold text-stone-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedRecipe ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400 font-mono">Copied recipe</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy recipe</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="rounded-lg border border-stone-800 bg-black/60 p-2 font-mono text-[9px] text-amber-200/90 break-all select-all leading-relaxed max-h-20 overflow-y-auto">
                    {variant.recipeUrl}
                  </div>
                </div>

                <div className="text-[10px] font-mono space-y-1 text-stone-400 pt-1">
                  <div className="p-1.5 rounded bg-black/40 border border-stone-800 flex items-center justify-between">
                    <span className="text-amber-300">Generative background</span>
                    <span>e_gen_background_replace</span>
                  </div>
                  <div className="p-1.5 rounded bg-black/40 border border-stone-800 flex items-center justify-between">
                    <span className="text-amber-300">Aspect outpaint</span>
                    <span>c_pad,b_gen_fill</span>
                  </div>
                  <div className="p-1.5 rounded bg-black/40 border border-stone-800 flex items-center justify-between">
                    <span className="text-amber-300">Indic text overlay</span>
                    <span>l_text:{variant.metadata.script}</span>
                  </div>
                </div>
              </div>
            </details>
          </div>

          {/* Action Buttons at Bottom */}
          <div className="pt-3 mt-4 border-t border-stone-800 flex items-center gap-2.5 shrink-0">
            <a
              href={variant.finalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-stone-700 bg-stone-900/90 hover:bg-stone-800 hover:border-stone-600 py-2.5 px-3 text-xs font-semibold text-stone-200 hover:text-white transition-all shadow-xs"
            >
              <span>Open full resolution</span>
              <ExternalLink className="h-3.5 w-3.5 text-stone-400" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-amber-500 hover:bg-amber-400 px-6 py-2.5 text-xs font-bold text-stone-950 transition-colors cursor-pointer shadow-xs shrink-0"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
