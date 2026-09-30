'use client';

import React from 'react';
import { Layers, ArrowDownRight, ExternalLink } from 'lucide-react';
import { AdaptrLogo } from './AdaptrLogo';

interface HeaderProps {
  activeJobsCount: number;
  totalVariantsCount: number;
  readyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  totalVariantsCount,
  readyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#fafaf9]/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Left: Distinctive Adaptr Brand Identity */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-3 group">
            {/* Adaptr Multi-Format Aperture Symbol */}
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-100/90 border border-stone-200 shadow-2xs transition-transform duration-200 group-hover:scale-105">
              <AdaptrLogo size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-base font-bold tracking-tight text-stone-900 leading-tight">
                PixelPradesh
              </span>
              <span className="text-[11px] text-stone-500 font-medium hidden sm:inline leading-tight">
                Creative Localization Studio
              </span>
            </div>
          </a>
        </div>

        {/* Center: Subtle Campaign Readiness Indicator */}
        <div className="hidden md:flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-600 shadow-2xs">
          {totalVariantsCount === 0 ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-stone-400"></span>
              <span className="font-medium text-stone-600">Initializing campaign</span>
            </>
          ) : readyCount < totalVariantsCount ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
              <span className="font-medium text-stone-800">{totalVariantsCount} creatives generated</span>
              <span className="text-stone-300">·</span>
              <span className="text-emerald-700 font-medium">{readyCount} ready</span>
              <span className="text-stone-300">·</span>
              <span className="text-amber-700 font-medium">{totalVariantsCount - readyCount} needs review</span>
            </>
          ) : (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span className="font-medium text-stone-800">{totalVariantsCount} creatives generated</span>
              <span className="text-stone-300">·</span>
              <span className="text-emerald-700 font-medium">{readyCount} / {totalVariantsCount} campaign-ready</span>
            </>
          )}
        </div>

        {/* Right: Restrained Navigation */}
        <nav className="flex items-center gap-2 sm:gap-4" aria-label="Main Navigation">
          <a
            href="#how-it-works"
            className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            How it works
          </a>

          <a
            href="#workspace"
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-800 shadow-2xs hover:border-stone-300 hover:bg-stone-50 transition-all"
          >
            <Layers className="h-3.5 w-3.5 text-amber-600" />
            <span>Workspace</span>
            <ArrowDownRight className="h-3 w-3 text-stone-400" />
          </a>

          <a
            href="mailto:contact@pixelpradesh.studio"
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors"
          >
            <span>Feedback</span>
            <ExternalLink className="h-3 w-3 text-stone-400" />
          </a>
        </nav>
      </div>
    </header>
  );
};
