'use client';

import React, { useState, useEffect } from 'react';
import { AdVariant } from '@/types/job';
import { VariantCard } from './VariantCard';
import { LayoutGrid, Layers, Globe2, Square, Smartphone, Monitor, Inbox, RefreshCw, Sparkles, Check } from 'lucide-react';

export type MatrixPerspective = 'overview' | 'by_channel' | 'by_region';

export const PipelineLoadingCockpit: React.FC = () => {
  const [stage, setStage] = useState<number>(1);

  useEffect(() => {
    // Stage 1: 0ms -> 850ms
    const t1 = setTimeout(() => setStage(2), 850);
    // Stage 2: 850ms -> 1750ms
    const t2 = setTimeout(() => setStage(3), 1750);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const stageDescriptions = [
    'Analyzing master photograph geometry and cultural subject boundaries...',
    'Synthesizing regional festive environments across Hindi, Bengali, Tamil, and Meitei...',
    'Composing 12 production creatives across feed, stories, and display banners...',
  ];

  return (
    <div className="rounded-2xl border border-stone-200/90 bg-white p-8 sm:p-12 text-center shadow-xs flex flex-col items-center justify-center space-y-6 animate-fadeIn">
      {/* Editorial Centerpiece Aperture Icon with Subtle Ambient Warmth */}
      <div className="relative flex items-center justify-center">
        <div className="absolute h-16 w-16 rounded-2xl bg-amber-500/10 animate-pulse pointer-events-none" />
        <div className="relative flex h-13 w-13 items-center justify-center rounded-2xl bg-stone-900 text-white shadow-sm ring-1 ring-stone-900/10">
          <RefreshCw className="h-5 w-5 animate-spin text-amber-400" />
        </div>
      </div>

      {/* Title & Dynamic Status Subtitle */}
      <div className="space-y-2 max-w-lg">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50/80 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
          <Sparkles className="h-3 w-3 text-amber-700 animate-pulse" />
          <span>Autonomous localization pipeline</span>
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
          Generating multi-format campaign
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed min-h-[2.5rem] flex items-center justify-center transition-all duration-300">
          {stageDescriptions[stage - 1]}
        </p>
      </div>

      {/* 3 Editorial Stage Cards matching Section 2 "How it Works" layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-2xl pt-2 text-left">
        {/* Step 01 */}
        <div
          className={`rounded-xl border p-4 space-y-2.5 transition-all duration-300 ${
            stage === 1
              ? 'border-amber-300 bg-amber-50/40 shadow-2xs'
              : 'border-stone-200/80 bg-stone-50/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`font-display text-base font-bold ${
                stage === 1 ? 'text-amber-800' : 'text-stone-900'
              }`}
            >
              01
            </span>
            {stage === 1 ? (
              <span className="inline-flex items-center gap-1 rounded border border-amber-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-amber-800 shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                <span>Active</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded border border-stone-200 bg-white px-2 py-0.5 text-[10px] font-medium text-stone-600 shadow-2xs">
                <Check className="h-2.5 w-2.5 text-stone-700" />
                <span>Locked</span>
              </span>
            )}
          </div>
          <div>
            <h4 className="font-display text-xs font-bold text-stone-900">
              Geometry Analysis
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
              Subject bounds & anchor lock
            </p>
          </div>
          {/* Subtle Hairline Progress */}
          <div className="h-0.5 w-full rounded-full bg-stone-200/80 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                stage > 1
                  ? 'w-full bg-stone-700'
                  : 'w-2/3 bg-amber-600 animate-pulse'
              }`}
            />
          </div>
        </div>

        {/* Step 02 */}
        <div
          className={`rounded-xl border p-4 space-y-2.5 transition-all duration-300 ${
            stage === 2
              ? 'border-amber-300 bg-amber-50/40 shadow-2xs'
              : 'border-stone-200/80 bg-stone-50/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`font-display text-base font-bold ${
                stage === 2 ? 'text-amber-800' : 'text-stone-900'
              }`}
            >
              02
            </span>
            {stage === 2 ? (
              <span className="inline-flex items-center gap-1 rounded border border-amber-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-amber-800 shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                <span>Active</span>
              </span>
            ) : stage > 2 ? (
              <span className="inline-flex items-center gap-1 rounded border border-stone-200 bg-white px-2 py-0.5 text-[10px] font-medium text-stone-600 shadow-2xs">
                <Check className="h-2.5 w-2.5 text-stone-700" />
                <span>Adapted</span>
              </span>
            ) : (
              <span className="rounded border border-stone-200/80 bg-white px-2 py-0.5 text-[10px] font-medium text-stone-400 shadow-2xs">
                Queued
              </span>
            )}
          </div>
          <div>
            <h4 className="font-display text-xs font-bold text-stone-900">
              Scene Localization
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
              4 cultural themes & Indic scripts
            </p>
          </div>
          {/* Subtle Hairline Progress */}
          <div className="h-0.5 w-full rounded-full bg-stone-200/80 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                stage > 2
                  ? 'w-full bg-stone-700'
                  : stage === 2
                  ? 'w-2/3 bg-amber-600 animate-pulse'
                  : 'w-0'
              }`}
            />
          </div>
        </div>

        {/* Step 03 */}
        <div
          className={`rounded-xl border p-4 space-y-2.5 transition-all duration-300 ${
            stage === 3
              ? 'border-amber-300 bg-amber-50/40 shadow-2xs'
              : 'border-stone-200/80 bg-stone-50/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`font-display text-base font-bold ${
                stage === 3 ? 'text-amber-800' : 'text-stone-900'
              }`}
            >
              03
            </span>
            {stage === 3 ? (
              <span className="inline-flex items-center gap-1 rounded border border-amber-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-amber-800 shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                <span>Active</span>
              </span>
            ) : (
              <span className="rounded border border-stone-200/80 bg-white px-2 py-0.5 text-[10px] font-medium text-stone-400 shadow-2xs">
                Queued
              </span>
            )}
          </div>
          <div>
            <h4 className="font-display text-xs font-bold text-stone-900">
              Format Outpaint
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
              12 creatives & safe margins
            </p>
          </div>
          {/* Subtle Hairline Progress */}
          <div className="h-0.5 w-full rounded-full bg-stone-200/80 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                stage === 3 ? 'w-2/3 bg-amber-600 animate-pulse' : 'w-0'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface CampaignMatrixProps {
  variants: AdVariant[];
  onInspectVariant: (variant: AdVariant) => void;
  isGenerating?: boolean;
}

export const CampaignMatrix: React.FC<CampaignMatrixProps> = ({
  variants,
  onInspectVariant,
  isGenerating = false,
}) => {
  const [perspective, setPerspective] = useState<MatrixPerspective>('overview');

  // Filter channels
  const feedVariants = variants.filter((v) => v.ratioId === '1_1');
  const reelVariants = variants.filter((v) => v.ratioId === '9_16');
  const bannerVariants = variants.filter((v) => v.ratioId === '16_9');

  // Filter regions
  const diwaliVariants = variants.filter(
    (v) => v.localeId.includes('hindi') || v.metadata.festival.toLowerCase().includes('diwali')
  );
  const pujaVariants = variants.filter(
    (v) => v.localeId.includes('bengali') || v.metadata.festival.toLowerCase().includes('durga')
  );
  const pongalVariants = variants.filter(
    (v) => v.localeId.includes('tamil') || v.metadata.festival.toLowerCase().includes('pongal')
  );
  const meiteiVariants = variants.filter(
    (v) => v.localeId.includes('meitei') || v.metadata.festival.toLowerCase().includes('ningol')
  );

  const marketRows = [
    {
      id: 'diwali',
      name: 'Diwali',
      region: 'North & West · Hindi',
      scriptFont: 'font-devanagari',
      scriptSample: 'शुभ दीपावली',
      variants: diwaliVariants,
    },
    {
      id: 'durga-puja',
      name: 'Durga Puja',
      region: 'Bengal & East · Bengali',
      scriptFont: 'font-bengali',
      scriptSample: 'শুভ শারদীয়া',
      variants: pujaVariants,
    },
    {
      id: 'pongal',
      name: 'Pongal',
      region: 'Tamil Nadu · Tamil',
      scriptFont: 'font-tamil',
      scriptSample: 'இனிய பொங்கல்',
      variants: pongalVariants,
    },
    {
      id: 'ningol',
      name: 'Ningol Chakouba',
      region: 'Manipur · Meitei',
      scriptFont: 'font-meetei',
      scriptSample: 'ꯅꯤꯉꯣꯜ ꯆꯥꯛꯀꯧꯕ',
      variants: meiteiVariants,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Editorial Matrix Header & Perspective Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              Campaign creatives
            </h2>
            <span className="rounded-full bg-stone-100 border border-stone-200 px-2.5 py-0.5 text-xs font-medium text-stone-700">
              {variants.length} creatives
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            12 creatives · 4 markets · 3 formats
          </p>
        </div>

        {/* Perspective Toggle: Overview / By format / By region */}
        <div className="w-full sm:w-auto grid grid-cols-3 sm:flex items-center rounded-xl border border-stone-200 bg-stone-100/80 p-1 shrink-0">
          <button
            onClick={() => setPerspective('overview')}
            className={`tactile-btn flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg px-2 sm:px-3 py-2 sm:py-1.5 text-[11px] sm:text-xs font-semibold transition-all min-h-[38px] sm:min-h-0 cursor-pointer ${
              perspective === 'overview'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5 text-stone-700 shrink-0" />
            <span className="hidden sm:inline">Overview (4×3)</span>
            <span className="sm:hidden">Overview</span>
          </button>
          <button
            onClick={() => setPerspective('by_channel')}
            className={`tactile-btn flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg px-2 sm:px-3 py-2 sm:py-1.5 text-[11px] sm:text-xs font-semibold transition-all min-h-[38px] sm:min-h-0 cursor-pointer ${
              perspective === 'by_channel'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-stone-700 shrink-0" />
            <span className="hidden sm:inline">By format</span>
            <span className="sm:hidden">Format</span>
          </button>
          <button
            onClick={() => setPerspective('by_region')}
            className={`tactile-btn flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg px-2 sm:px-3 py-2 sm:py-1.5 text-[11px] sm:text-xs font-semibold transition-all min-h-[38px] sm:min-h-0 cursor-pointer ${
              perspective === 'by_region'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Globe2 className="h-3.5 w-3.5 text-stone-700 shrink-0" />
            <span className="hidden sm:inline">By region</span>
            <span className="sm:hidden">Region</span>
          </button>
        </div>
      </div>

      {/* Loading State during Generation */}
      {isGenerating ? (
        <PipelineLoadingCockpit />
      ) : (
        <>
          {/* Empty State */}
          {variants.length === 0 && (
            <div className="editorial-surface rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3 bg-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 border border-stone-200 text-stone-400">
                <Inbox className="h-6 w-6" />
              </div>
              <h3 className="font-display text-base font-semibold text-stone-800">
                No creatives match filter
              </h3>
              <p className="text-xs text-stone-500 max-w-sm">
                Adjust your search query or reset market and format filters to view all campaign assets.
              </p>
            </div>
          )}

      {/* PERSPECTIVE 1: OVERVIEW CONTACT SHEET (4 Markets × 3 Formats) */}
      {perspective === 'overview' && variants.length > 0 && (
        <div className="space-y-4">
          {/* Format Column Headers */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-4 pb-2 border-b border-stone-200/80 text-xs font-semibold text-stone-500">
            <div className="lg:col-span-3">Market</div>
            <div className="lg:col-span-3 flex items-center gap-1.5">
              <Square className="h-3.5 w-3.5 text-stone-600" />
              <span>1:1 Social Feed</span>
            </div>
            <div className="lg:col-span-3 flex items-center gap-1.5">
              <Smartphone className="h-3.5 w-3.5 text-stone-600" />
              <span>9:16 Stories & Reels</span>
            </div>
            <div className="lg:col-span-3 flex items-center gap-1.5">
              <Monitor className="h-3.5 w-3.5 text-stone-600" />
              <span>16:9 Display</span>
            </div>
          </div>

          {/* 4 Market Rows */}
          {marketRows.map((row) => {
            const rowVariants = row.variants;
            if (rowVariants.length === 0) return null;

            const v1_1 = rowVariants.find((v) => v.ratioId === '1_1');
            const v9_16 = rowVariants.find((v) => v.ratioId === '9_16');
            const v16_9 = rowVariants.find((v) => v.ratioId === '16_9');

            return (
              <div
                key={row.id}
                className="rounded-xl border border-stone-200/80 bg-white p-3.5 sm:p-4 shadow-2xs"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  {/* Market Descriptor Column (3 cols) */}
                  <div className="lg:col-span-3 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-amber-700 font-semibold tracking-wider block">
                      Market
                    </span>
                    <h3 className="font-display text-base font-bold text-stone-900 leading-tight">
                      {row.name}
                    </h3>
                    <p className="text-xs text-stone-500 leading-tight">
                      {row.region}
                    </p>
                    <p className={`text-xs text-stone-600 pt-0.5 ${row.scriptFont}`}>
                      {row.scriptSample}
                    </p>
                  </div>

                  {/* 3 Formats (3 cols each = 9 cols total) */}
                  <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {v1_1 && (
                      <VariantCard
                        key={v1_1.id}
                        variant={v1_1}
                        onInspect={onInspectVariant}
                        compact
                      />
                    )}
                    {v9_16 && (
                      <VariantCard
                        key={v9_16.id}
                        variant={v9_16}
                        onInspect={onInspectVariant}
                        compact
                      />
                    )}
                    {v16_9 && (
                      <VariantCard
                        key={v16_9.id}
                        variant={v16_9}
                        onInspect={onInspectVariant}
                        compact
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PERSPECTIVE A: GROUPED BY CHANNEL FORMAT */}
      {perspective === 'by_channel' && variants.length > 0 && (
        <div className="space-y-10">
          {/* Format 1: 1:1 Social Feed */}
          {feedVariants.length > 0 && (
            <section aria-labelledby="format-feed-heading">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-200/70">
                <div className="flex items-center gap-2">
                  <Square className="h-4 w-4 text-stone-700" />
                  <h3 id="format-feed-heading" className="font-display text-sm font-bold text-stone-900">
                    Social feed
                  </h3>
                </div>
                <span className="text-xs font-medium text-stone-500">
                  1:1 · {feedVariants.length} creatives
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {feedVariants.map((variant) => (
                  <VariantCard
                    key={variant.id}
                    variant={variant}
                    onInspect={onInspectVariant}
                    compact
                  />
                ))}
              </div>
            </section>
          )}

          {/* Format 2: 9:16 Stories & Reels */}
          {reelVariants.length > 0 && (
            <section aria-labelledby="format-reels-heading">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-200/70">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-stone-700" />
                  <h3 id="format-reels-heading" className="font-display text-sm font-bold text-stone-900">
                    Stories & reels
                  </h3>
                </div>
                <span className="text-xs font-medium text-stone-500">
                  9:16 · {reelVariants.length} creatives
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {reelVariants.map((variant) => (
                  <VariantCard
                    key={variant.id}
                    variant={variant}
                    onInspect={onInspectVariant}
                    compact
                  />
                ))}
              </div>
            </section>
          )}

          {/* Format 3: 16:9 Display */}
          {bannerVariants.length > 0 && (
            <section aria-labelledby="format-display-heading">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-200/70">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-stone-700" />
                  <h3 id="format-display-heading" className="font-display text-sm font-bold text-stone-900">
                    Display
                  </h3>
                </div>
                <span className="text-xs font-medium text-stone-500">
                  16:9 · {bannerVariants.length} creatives
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {bannerVariants.map((variant) => (
                  <VariantCard
                    key={variant.id}
                    variant={variant}
                    onInspect={onInspectVariant}
                    compact
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* PERSPECTIVE B: GROUPED BY REGIONAL LOCALE */}
      {perspective === 'by_region' && variants.length > 0 && (
        <div className="space-y-10">
          {/* North - Diwali */}
          {diwaliVariants.length > 0 && (
            <section aria-labelledby="region-diwali-heading">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-200/70">
                <div>
                  <h3 id="region-diwali-heading" className="font-display text-sm font-bold text-stone-900">
                    Diwali
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Hindi · North & West <span className="font-devanagari text-stone-700 ml-1.5 font-medium">शुभ दीपावली</span>
                  </p>
                </div>
                <span className="text-xs font-medium text-stone-500">
                  3 formats
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                {diwaliVariants.map((variant) => (
                  <VariantCard
                    key={variant.id}
                    variant={variant}
                    onInspect={onInspectVariant}
                    compact
                  />
                ))}
              </div>
            </section>
          )}

          {/* East - Durga Puja */}
          {pujaVariants.length > 0 && (
            <section aria-labelledby="region-puja-heading">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-200/70">
                <div>
                  <h3 id="region-puja-heading" className="font-display text-sm font-bold text-stone-900">
                    Durga Puja
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Bengali · East <span className="font-bengali text-stone-700 ml-1.5 font-medium">শুভ শারদীয়া</span>
                  </p>
                </div>
                <span className="text-xs font-medium text-stone-500">
                  3 formats
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                {pujaVariants.map((variant) => (
                  <VariantCard
                    key={variant.id}
                    variant={variant}
                    onInspect={onInspectVariant}
                    compact
                  />
                ))}
              </div>
            </section>
          )}

          {/* South - Pongal */}
          {pongalVariants.length > 0 && (
            <section aria-labelledby="region-pongal-heading">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-200/70">
                <div>
                  <h3 id="region-pongal-heading" className="font-display text-sm font-bold text-stone-900">
                    Pongal
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Tamil · South <span className="font-tamil text-stone-700 ml-1.5 font-medium">இனிய பொங்கல்</span>
                  </p>
                </div>
                <span className="text-xs font-medium text-stone-500">
                  3 formats
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                {pongalVariants.map((variant) => (
                  <VariantCard
                    key={variant.id}
                    variant={variant}
                    onInspect={onInspectVariant}
                    compact
                  />
                ))}
              </div>
            </section>
          )}

          {/* Northeast - Ningol Chakouba */}
          {meiteiVariants.length > 0 && (
            <section aria-labelledby="region-meitei-heading">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-200/70">
                <div>
                  <h3 id="region-meitei-heading" className="font-display text-sm font-bold text-stone-900">
                    Ningol Chakouba
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Meitei · Northeast <span className="font-meetei text-stone-700 ml-1.5 font-medium">ꯅꯤꯉꯣꯜ ꯆꯥꯛꯀꯧꯕ</span>
                  </p>
                </div>
                <span className="text-xs font-medium text-stone-500">
                  3 formats
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                {meiteiVariants.map((variant) => (
                  <VariantCard
                    key={variant.id}
                    variant={variant}
                    onInspect={onInspectVariant}
                    compact
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
        </>
      )}
    </div>
  );
};
