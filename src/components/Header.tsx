'use client';

import React, { useState } from 'react';
import { Layers, ArrowDownRight, ExternalLink, Sparkles, X, Info } from 'lucide-react';
import { AdaptrLogo } from './AdaptrLogo';
import { JudgeNoticeModal } from './JudgeNoticeModal';

interface HeaderProps {
  activeJobsCount: number;
  totalVariantsCount: number;
  readyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  totalVariantsCount,
  readyCount,
}) => {
  const [showJudgeBanner, setShowJudgeBanner] = useState<boolean>(true);
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState<boolean>(false);

  return (
    <>
      <JudgeNoticeModal
        isOpen={isJudgeModalOpen}
        onClose={() => setIsJudgeModalOpen(false)}
      />

      {/* Top Banner: Judge Preview & Cloudinary Transparency */}
      {showJudgeBanner && (
        <div className="bg-stone-900 border-b border-stone-800 text-stone-300 px-4 py-2 text-xs">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-hidden text-ellipsis">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-300 shrink-0">
                <Sparkles className="h-3 w-3 text-amber-400" />
                <span>Judge Preview</span>
              </span>
              <span className="text-stone-300 text-[11px] sm:text-xs truncate">
                Interactive Demo Mode active for zero-latency evaluation. Built natively on Cloudinary Generative AI.
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsJudgeModalOpen(true)}
                className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium text-amber-400 hover:text-amber-300 hover:bg-stone-800 transition-colors cursor-pointer underline underline-offset-2"
              >
                <span>Verify Cloudinary Pipeline</span>
                <Info className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => setShowJudgeBanner(false)}
                className="text-stone-500 hover:text-stone-300 transition-colors p-0.5 cursor-pointer"
                title="Dismiss banner"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

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
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-base font-bold tracking-tight text-stone-900 leading-tight">
                    PixelPradesh
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200 font-semibold">
                    Demo
                  </span>
                </div>
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
          <nav className="flex items-center gap-2 sm:gap-3" aria-label="Main Navigation">
            <button
              type="button"
              onClick={() => setIsJudgeModalOpen(true)}
              className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50/70 px-2.5 py-1.5 text-xs font-semibold text-amber-900 shadow-2xs hover:bg-amber-100 transition-colors cursor-pointer"
            >
              <Sparkles className="h-3 w-3 text-amber-700" />
              <span>Judge Guide</span>
            </button>

            <a
              href="#how-it-works"
              className="px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
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
              className="hidden lg:inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors"
            >
              <span>Feedback</span>
              <ExternalLink className="h-3 w-3 text-stone-400" />
            </a>
          </nav>
        </div>
      </header>
    </>
  );
};
