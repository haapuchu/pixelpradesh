'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowLeftRight } from 'lucide-react';

interface BeforeAfterSliderProps {
  masterUrl: string;
  variantUrl: string;
  masterLabel?: string;
  variantLabel?: string;
  ratio?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  masterUrl,
  variantUrl,
  masterLabel = 'Master asset',
  variantLabel = 'Localized creative',
  ratio = '1:1',
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 to 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [variantError, setVariantError] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVariantError(false);
  }, [variantUrl, masterUrl]);

  const effectiveVariantUrl = !variantError && variantUrl ? variantUrl : masterUrl;

  const is9_16 = ratio === '9:16' || ratio === '9_16';
  const is16_9 = ratio === '16:9' || ratio === '16_9';

  const containerAspectClasses = is9_16
    ? 'aspect-[9/16] h-[52vh] max-h-[480px] w-auto mx-auto'
    : is16_9
    ? 'aspect-[16/9] w-full max-w-2xl mx-auto'
    : 'aspect-square w-full max-w-[390px] mx-auto';

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const displayMasterLabel = is9_16 ? 'Master' : masterLabel;
  const displayVariantLabel = is9_16 ? 'Localized' : variantLabel;

  return (
    <div
      ref={containerRef}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={() => setIsDragging(true)}
      onTouchEnd={() => setIsDragging(false)}
      onTouchMove={handleTouchMove}
      className={`relative ${containerAspectClasses} select-none overflow-hidden rounded-2xl border border-stone-800/90 bg-[#0c0a09] cursor-ew-resize shadow-2xl touch-none`}
    >
      {/* Background Image: Localized Creative (Right/After) */}
      <div className="absolute inset-0 flex items-center justify-center bg-[#0c0a09]">
        <img
          src={effectiveVariantUrl}
          alt={displayVariantLabel}
          onError={() => setVariantError(true)}
          className="h-full w-full object-contain"
        />
      </div>

      {/* Foreground Image: Master Asset (Left/Before) with clip-path */}
      <div
        className="absolute inset-0 overflow-hidden bg-[#0c0a09] flex items-center justify-center"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={masterUrl}
          alt={displayMasterLabel}
          className="h-full w-full object-contain"
        />
      </div>

      {/* Top Header Badges with safety padding */}
      <div className="pointer-events-none absolute inset-x-3 top-3 z-30 flex items-center justify-between gap-2">
        <div className="rounded-lg bg-black/85 backdrop-blur-md px-2.5 py-1 text-[10.5px] sm:text-[11px] font-medium text-stone-200 border border-white/10 shadow-sm truncate max-w-[48%]">
          {displayMasterLabel}
        </div>
        <div className="rounded-lg bg-black/85 backdrop-blur-md px-2.5 py-1 text-[10.5px] sm:text-[11px] font-medium text-amber-400 border border-amber-500/30 shadow-sm truncate max-w-[48%] text-right">
          {displayVariantLabel}
        </div>
      </div>

      {/* Slider Bar & Handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.8)] pointer-events-none z-30"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-900 shadow-xl ring-2 ring-black/50">
          <ArrowLeftRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
};
