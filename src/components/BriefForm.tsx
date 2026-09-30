'use client';

import React from 'react';
import { SUPPORTED_LOCALES } from '@/config/locales.config';
import { SUPPORTED_RATIOS } from '@/config/ratios.config';
import { Sliders, Wand2, Check, Globe2, Ratio } from 'lucide-react';

interface BriefFormProps {
  productName: string;
  onProductNameChange: (val: string) => void;
  category: string;
  onCategoryChange: (val: string) => void;
  brief: string;
  onBriefChange: (val: string) => void;
  selectedLocales: string[];
  onToggleLocale: (id: string) => void;
  selectedRatios: string[];
  onToggleRatio: (id: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
}

export const BriefForm: React.FC<BriefFormProps> = ({
  productName,
  onProductNameChange,
  category,
  onCategoryChange,
  brief,
  onBriefChange,
  selectedLocales,
  onToggleLocale,
  selectedRatios,
  onToggleRatio,
  isGenerating,
  onGenerate,
}) => {
  const totalCount = selectedLocales.length * selectedRatios.length;

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-800">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <Sliders className="h-4 w-4 text-rose-400" />
          2. Campaign Strategy & Regional Targeting
        </h2>
        <p className="text-xs text-slate-400">
          Set brand context, target festivals, and multi-channel aspect ratios.
        </p>
      </div>

      <div className="space-y-4">
        {/* Product Name & Category */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">Product Brand Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => onProductNameChange(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Campaign Brief */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-300">Campaign Core Hook & Brief</label>
          <textarea
            rows={2}
            value={brief}
            onChange={(e) => onBriefChange(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none resize-none"
          />
        </div>

        {/* Locales Selector */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Globe2 className="h-3.5 w-3.5 text-indigo-400" />
              Target Regional Locales ({selectedLocales.length}/4)
            </label>
            <span className="text-[11px] text-slate-400">Includes Meitei Mayek script</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {Object.values(SUPPORTED_LOCALES).map((loc) => {
              const isChecked = selectedLocales.includes(loc.id);
              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => onToggleLocale(loc.id)}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left transition-all ${
                    isChecked
                      ? 'border-indigo-400/80 bg-indigo-950/40 text-white'
                      : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="min-w-0 pr-1">
                    <p className="truncate text-xs font-semibold">{loc.festival}</p>
                    <p className="truncate text-[10px] text-slate-400">{loc.language}</p>
                  </div>
                  <div
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      isChecked ? 'border-indigo-400 bg-indigo-500 text-white' : 'border-slate-600'
                    }`}
                  >
                    {isChecked && <Check className="h-2.5 w-2.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Aspect Ratios Selector */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <Ratio className="h-3.5 w-3.5 text-emerald-400" />
            Channel Format Outputs ({selectedRatios.length}/3)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {Object.values(SUPPORTED_RATIOS).map((rat) => {
              const isChecked = selectedRatios.includes(rat.id);
              return (
                <button
                  key={rat.id}
                  type="button"
                  onClick={() => onToggleRatio(rat.id)}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left transition-all ${
                    isChecked
                      ? 'border-emerald-400/80 bg-emerald-950/40 text-white'
                      : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <p className="text-xs font-semibold">{rat.aspect}</p>
                    <p className="text-[10px] text-slate-400">{rat.name}</p>
                  </div>
                  <div
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      isChecked ? 'border-emerald-400 bg-emerald-500 text-white' : 'border-slate-600'
                    }`}
                  >
                    {isChecked && <Check className="h-2.5 w-2.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <button
            type="button"
            disabled={isGenerating || totalCount === 0}
            onClick={onGenerate}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-rose-500/25 transition-all hover:scale-[1.01] hover:shadow-rose-500/40 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Running Cloudinary AI State Machine...</span>
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 transition-transform group-hover:rotate-12" />
                <span>Generate {totalCount}-Ad Regional Matrix</span>
                <span className="rounded-md bg-white/20 px-2 py-0.5 text-xs text-white/90">
                  Instant Preview
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
