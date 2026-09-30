'use client';

import React, { useState, useEffect } from 'react';
import { AdVariant } from '@/types/job';
import { AlertCircle, Check, Eye, RefreshCw, Layout } from 'lucide-react';
import { getLocalVariantUrl } from '@/lib/transformations';

interface VariantCardProps {
  variant: AdVariant;
  onInspect: (variant: AdVariant) => void;
  compact?: boolean;
}

export const VariantCard: React.FC<VariantCardProps> = ({ variant, onInspect, compact = false }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasFallenBack, setHasFallenBack] = useState(false);

  const isFlagged = variant.status === 'FLAGGED';
  const isProcessing = variant.status === 'PROCESSING';

  // Format label
  const formatLabel =
    variant.ratioId === '9_16'
      ? '9:16 Stories'
      : variant.ratioId === '16_9'
      ? '16:9 Banner'
      : '1:1 Feed';

  const ratioAspect =
    variant.ratioId === '9_16' ? '9:16' : variant.ratioId === '16_9' ? '16:9' : '1:1';

  // Compute fallback source that always preserves the master product or local high-res ad creative
  const localAdCreative = getLocalVariantUrl(variant.masterPublicId, variant.localeId, variant.ratioId);
  const cleanMasterId = variant.masterPublicId?.replace(/\.(jpg|jpeg|png|webp)$/i, '') || 'pixelpradesh_masters/kaju_katli_master';
  const masterFallbackSrc = localAdCreative || `https://res.cloudinary.com/dcgug3wg/image/upload/c_pad,ar_${ratioAspect},b_gen_fill/f_auto,q_auto/${cleanMasterId}.jpg`;

  const [currentSrc, setCurrentSrc] = useState<string>(variant.finalUrl || localAdCreative || masterFallbackSrc);

  // Sync state whenever the variant or its finalUrl updates
  useEffect(() => {
    const freshLocal = getLocalVariantUrl(variant.masterPublicId, variant.localeId, variant.ratioId);
    setCurrentSrc(variant.finalUrl || freshLocal || masterFallbackSrc);
    setImageLoaded(false);
    setImageError(false);
    setHasFallenBack(false);
  }, [variant.id, variant.finalUrl, variant.masterPublicId, variant.localeId, variant.ratioId, masterFallbackSrc]);

  const handleImageError = () => {
    if (!hasFallenBack && currentSrc !== localAdCreative) {
      setHasFallenBack(true);
      setCurrentSrc(localAdCreative);
    } else {
      setImageError(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onInspect(variant);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onInspect(variant)}
      onKeyDown={handleKeyDown}
      aria-label={`Inspect ${variant.metadata.festival} ${formatLabel} creative`}
      className={`group editorial-card relative flex flex-col overflow-hidden rounded-xl cursor-pointer bg-white transition-all ${
        isFlagged
          ? 'border-amber-300 shadow-sm'
          : 'border-stone-200/80 hover:border-stone-400'
      }`}
    >
      {/* Normalized Media Canvas: Artwork Dominates with intentional aspect framing */}
      <div
        className={`relative w-full ${
          compact ? 'h-40 sm:h-44' : 'h-52 sm:h-56'
        } overflow-hidden bg-[#f5f5f4] flex items-center justify-center p-2 select-none`}
      >
        {isProcessing ? (
          <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center bg-stone-50">
            <RefreshCw className="h-5 w-5 animate-spin text-stone-600 mb-2" />
            <span className="text-xs font-medium text-stone-600">
              Rendering creative...
            </span>
          </div>
        ) : (
          <div className="relative h-full w-full flex items-center justify-center">
            {/* If image loads properly */}
            {!imageError && currentSrc ? (
              <img
                src={currentSrc}
                alt={`${variant.metadata.festival} ${formatLabel}`}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={handleImageError}
                className={`max-h-full max-w-full object-contain rounded shadow-2xs transition-transform duration-300 ease-out group-hover:scale-[1.02] ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ) : null}

            {/* Intentional Architectural Crop-Frame Placeholder */}
            {(!imageLoaded || imageError || !currentSrc) && (
              <div className="media-canvas absolute inset-0 rounded-lg flex flex-col items-center justify-center p-4 text-center">
                {/* 4 Corner Crop Brackets from Adaptr brand aperture */}
                <div className="crop-bracket-tl" />
                <div className="crop-bracket-tr" />
                <div className="crop-bracket-bl" />
                <div className="crop-bracket-br" />

                <div className="h-8 w-8 rounded-lg border border-stone-300/80 bg-white/90 backdrop-blur-xs flex items-center justify-center text-stone-600 shadow-2xs mb-2">
                  <Layout className="h-4 w-4" />
                </div>
                <span className="font-display text-xs font-bold text-stone-800 tracking-tight">
                  Creative preview
                </span>
                <span className="text-[11px] text-stone-500 font-medium mt-0.5">
                  {variant.metadata.festival} · {formatLabel}
                </span>
              </div>
            )}

            {/* Hover Inspection Overlay */}
            <div className="absolute inset-0 bg-stone-900/15 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center pointer-events-none rounded-lg">
              <span className="flex items-center gap-1.5 rounded-full bg-white/95 text-stone-900 px-3 py-1.5 text-xs font-semibold shadow-md backdrop-blur-sm transform translate-y-1 group-hover:translate-y-0 transition-transform duration-150">
                <Eye className="h-3.5 w-3.5 text-stone-700" />
                <span>Inspect</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Restrained Metadata Hierarchy (Artwork dominates, clean concise labels) */}
      <div className="flex flex-col gap-1 border-t border-stone-100 bg-white p-3 text-xs">
        {/* Dominant Label: Festival & Status */}
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-stone-900 text-xs sm:text-[13px] tracking-tight truncate">
            {variant.metadata.festival}
          </span>

          {/* Clean Status Indicator */}
          <div>
            {isFlagged ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-800">
                <AlertCircle className="h-2.5 w-2.5" />
                <span>Needs review</span>
              </span>
            ) : isProcessing ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-[10px] font-medium text-stone-600">
                <span>Rendering</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-800">
                <Check className="h-2.5 w-2.5 text-emerald-600" />
                <span>Ready</span>
              </span>
            )}
          </div>
        </div>

        {/* Secondary Subtitle: Locale Geography & Script */}
        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-0.5">
          <span className="truncate">{variant.metadata.locale}</span>
          <span className="text-[10px] font-medium text-stone-400 sm:hidden">{formatLabel}</span>
        </div>
      </div>
    </div>
  );
};
