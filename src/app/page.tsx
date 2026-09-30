'use client';

import React, { useState, useEffect } from 'react';
import { SAMPLE_PRODUCTS, SampleProduct } from '@/config/samples.config';
import { DEFAULT_LOCALE_IDS } from '@/config/locales.config';
import { DEFAULT_RATIO_IDS } from '@/config/ratios.config';
import { AdaptrJob, AdVariant } from '@/types/job';
import { Header } from '@/components/Header';
import { MasterAssetDock } from '@/components/MasterAssetDock';
import { CampaignMatrix } from '@/components/CampaignMatrix';
import { StudioLightbox } from '@/components/StudioLightbox';
import { SearchFilterBar } from '@/components/SearchFilterBar';
import { StudioNotification, NotificationType } from '@/components/StudioNotification';
import { UploadedFileMetadata } from '@/components/HeroUploader';
import { AdaptrLogo } from '@/components/AdaptrLogo';
import {
  ArrowRight,
  ArrowDownRight,
  Layers,
  ChevronDown,
  Upload,
  MapPin,
  Check,
  ChevronRight,
} from 'lucide-react';

export default function Home() {
  const [selectedSample, setSelectedSample] = useState<SampleProduct>(SAMPLE_PRODUCTS[0]);
  const [customUrl, setCustomUrl] = useState<string>('');
  const [customPublicId, setCustomPublicId] = useState<string>('');
  const [productName, setProductName] = useState<string>(SAMPLE_PRODUCTS[0].name);
  const [brief, setBrief] = useState<string>(SAMPLE_PRODUCTS[0].defaultBrief);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentJob, setCurrentJob] = useState<AdaptrJob | null>(null);
  const [inspectingVariant, setInspectingVariant] = useState<AdVariant | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFestival, setSelectedFestival] = useState<string>('all');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');

  const [notification, setNotification] = useState<{
    type: NotificationType;
    message: string;
  } | null>(null);

  // Core campaign generator with realistic loading delay
  const triggerCampaignGeneration = async (options?: {
    sample?: SampleProduct;
    name?: string;
    briefText?: string;
    url?: string;
    pubId?: string;
  }) => {
    setIsGenerating(true);
    const targetSample = options?.sample || selectedSample;
    const targetName = options?.name ?? productName;
    const targetBrief = options?.briefText ?? brief;
    const masterUrl = options?.url || customUrl || targetSample.thumbnailUrl;
    const masterPublicId =
      options?.pubId ||
      customPublicId ||
      (customUrl ? `upload_${Date.now()}` : targetSample.masterPublicId);

    try {
      // Simulate realistic autonomous localization pipeline duration (~1.8 seconds)
      const [res] = await Promise.all([
        fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productName: targetName,
            category: targetSample.category,
            brief: targetBrief,
            masterPublicId,
            masterUrl,
            selectedLocales: DEFAULT_LOCALE_IDS,
            selectedRatios: DEFAULT_RATIO_IDS,
          }),
        }),
        new Promise((resolve) => setTimeout(resolve, 2600)),
      ]);

      const data = await res.json();
      if (data.success && data.job) {
        setCurrentJob(data.job);
        setNotification({
          type: 'success',
          message: `12 localized campaign creatives generated for "${targetName}".`,
        });
      } else {
        setNotification({
          type: 'error',
          message: data.error || 'Failed to generate campaign job.',
        });
      }
    } catch (e) {
      console.error('Error generating job:', e);
      setNotification({
        type: 'error',
        message: 'Network error generating campaign. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle switching sample product
  const handleSelectSample = (sample: SampleProduct) => {
    setSelectedSample(sample);
    setProductName(sample.name);
    setBrief(sample.defaultBrief);
    setCustomUrl('');
    setCustomPublicId('');

    // Trigger campaign generation with realistic loading sequence
    triggerCampaignGeneration({
      sample,
      name: sample.name,
      briefText: sample.defaultBrief,
      url: sample.thumbnailUrl,
      pubId: sample.masterPublicId,
    });
  };

  const handleFileUploaded = (meta: UploadedFileMetadata) => {
    setCustomUrl(meta.url);
    setCustomPublicId(meta.publicId);
    if (meta.name) setProductName(meta.name);
    if (meta.brief) setBrief(meta.brief);
    setNotification({
      type: 'success',
      message: `Master asset "${meta.fileName || 'custom image'}" uploaded successfully.`,
    });
    // Trigger campaign generation for uploaded asset
    triggerCampaignGeneration({
      name: meta.name || productName,
      briefText: meta.brief || brief,
      url: meta.url,
      pubId: meta.publicId,
    });
    scrollToCampaignCreatives();
  };

  const handleClearCustom = () => {
    setCustomUrl('');
    setCustomPublicId('');
    setProductName(selectedSample.name);
    setBrief(selectedSample.defaultBrief);
    triggerCampaignGeneration({
      sample: selectedSample,
      name: selectedSample.name,
      briefText: selectedSample.defaultBrief,
      url: selectedSample.thumbnailUrl,
      pubId: selectedSample.masterPublicId,
    });
  };

  // Smoothly move screen to the working campaign creatives section
  const scrollToCampaignCreatives = () => {
    setTimeout(() => {
      const el = document.getElementById('campaign-creatives');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  // Generate Campaign Matrix
  const handleGenerate = () => {
    triggerCampaignGeneration();
    scrollToCampaignCreatives();
  };

  // Fix layout & margins for flagged variant
  const handleRegenerateVariant = async (variantId: string) => {
    if (!currentJob) return;
    try {
      const res = await fetch(`/api/jobs/${currentJob.id}/variants/${variantId}/regenerate`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success && data.variant) {
        setCurrentJob((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            variants: prev.variants.map((v) => (v.id === variantId ? data.variant : v)),
          };
        });
        setInspectingVariant(data.variant);
        setNotification({
          type: 'success',
          message: `Variant ${data.variant.metadata.festival} updated with compliant safe margins.`,
        });
      }
    } catch (e) {
      console.error('Error regenerating variant:', e);
      setNotification({
        type: 'error',
        message: 'Failed to fix variant layout. Please retry.',
      });
    }
  };

  // Auto-initialize demo job on first visit so initial creatives load immediately
  useEffect(() => {
    let isCancelled = false;
    async function loadInitialJob() {
      try {
        const masterUrl = selectedSample.thumbnailUrl;
        const masterPublicId = selectedSample.masterPublicId;

        const res = await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productName: selectedSample.name,
            category: selectedSample.category,
            brief: selectedSample.defaultBrief,
            masterPublicId,
            masterUrl,
            selectedLocales: DEFAULT_LOCALE_IDS,
            selectedRatios: DEFAULT_RATIO_IDS,
          }),
        });

        const data = await res.json();
        if (!isCancelled && data.success && data.job) {
          setCurrentJob(data.job);
        }
      } catch (e) {
        console.error('Error loading initial job:', e);
      }
    }

    loadInitialJob();
    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter variants based on search, festival, and channel
  const allVariants = currentJob?.variants || [];
  const filteredVariants = allVariants.filter((v) => {
    if (selectedFestival !== 'all' && !v.metadata.festival.toLowerCase().includes(selectedFestival)) {
      return false;
    }
    if (selectedChannel !== 'all' && v.ratioId !== selectedChannel) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchText =
        `${v.metadata.festival} ${v.metadata.locale} ${v.metadata.headline} ${v.metadata.cta} ${v.metadata.script}`.toLowerCase();
      if (!matchText.includes(query)) return false;
    }
    return true;
  });

  const readyCount = allVariants.filter((v) => v.status === 'READY').length;

  return (
    <div className="min-h-screen bg-[#fafaf9] text-stone-900 flex flex-col selection:bg-amber-100 selection:text-amber-900">
      {/* Top Navigation */}
      <Header
        activeJobsCount={currentJob ? 1 : 0}
        totalVariantsCount={allVariants.length}
        readyCount={readyCount}
      />

      {/* SPACIOUS 2-COLUMN HERO SECTION — Clean, breathable, editorial hierarchy */}
      <section className="relative border-b border-stone-200/80 bg-gradient-to-b from-stone-50/70 to-[#fafaf9] pt-12 pb-16 sm:pt-16 sm:pb-20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Column 1: Manifesto & Stats (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[48px] font-bold tracking-tight text-stone-900 leading-[1.08]">
                One product.{' '}
                <br />
                <span className="font-editorial italic font-normal text-stone-600">
                  Every market.
                </span>{' '}
                <br />
                Ready to launch.
              </h1>

              <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-lg">
                Turn one product image into culturally localized campaign creatives across India&apos;s regional markets, languages, and multi-channel formats.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#workspace"
                  className="saffron-btn inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-xs transition-all hover:scale-[1.01]"
                >
                  <span>Create campaign</span>
                  <ArrowRight className="h-4 w-4" />
                </a>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-stone-700 hover:bg-stone-50 transition-colors shadow-2xs"
                >
                  How it works
                </a>
              </div>

              {/* Multiplier Stats: 01 — 04 — 03 — 12 */}
              <div className="flex items-center gap-5 sm:gap-7 pt-6 border-t border-stone-200/80 max-w-lg">
                <div>
                  <div className="font-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">01</div>
                  <div className="text-[11px] sm:text-xs font-medium text-stone-500 mt-0.5">Master asset</div>
                </div>
                <span className="text-stone-300 select-none pb-4 font-light text-lg sm:text-xl">—</span>
                <div>
                  <div className="font-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">04</div>
                  <div className="text-[11px] sm:text-xs font-medium text-stone-500 mt-0.5">Regional markets</div>
                </div>
                <span className="text-stone-300 select-none pb-4 font-light text-lg sm:text-xl">—</span>
                <div>
                  <div className="font-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">03</div>
                  <div className="text-[11px] sm:text-xs font-medium text-stone-500 mt-0.5">Formats</div>
                </div>
                <span className="text-stone-300 select-none pb-4 font-light text-lg sm:text-xl">—</span>
                <div>
                  <div className="font-display text-2xl sm:text-3xl font-bold text-amber-700 tracking-tight">12</div>
                  <div className="text-[11px] sm:text-xs font-semibold text-stone-700 mt-0.5">Ready creatives</div>
                </div>
              </div>
            </div>

            {/* Column 2: Compact Campaign Contact Sheet Card (lg:col-span-5) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-[420px] rounded-2xl border border-stone-200/90 bg-white p-4 sm:p-5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] ring-1 ring-stone-900/5">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-stone-100 border border-stone-200 text-stone-800">
                      <AdaptrLogo size={15} />
                    </div>
                    <span className="text-xs font-bold text-stone-900 tracking-tight">
                      Campaign contact sheet
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      Live preview
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium">
                    <span className="text-stone-900 font-bold">{readyCount}</span> / {allVariants.length || 12} ready
                  </span>
                </div>

                {/* Master Asset Row */}
                <div className="group relative flex items-center justify-between p-2.5 rounded-xl border border-stone-200/70 bg-stone-50/60 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={selectedSample.thumbnailUrl}
                      alt={selectedSample.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=800&auto=format&fit=crop&q=80';
                      }}
                      className="h-9 w-9 rounded-lg object-cover border border-stone-200 shrink-0 shadow-2xs"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-amber-700 block leading-tight font-mono">
                        MASTER ASSET · 1 HERO SHOT
                      </span>
                      <h4 className="text-xs font-bold text-stone-900 truncate mt-0.5">
                        {selectedSample.name}
                      </h4>
                      <span className="text-[10px] text-stone-500 truncate block">
                        {selectedSample.category}
                      </span>
                    </div>
                  </div>
                  <a
                    href="#workspace"
                    className="inline-flex items-center gap-1 rounded-md border border-stone-200 bg-white px-2 py-1 text-[10px] font-semibold text-stone-700 hover:bg-stone-50 shrink-0 shadow-2xs transition-colors"
                  >
                    <span>View master</span>
                    <ArrowRight className="h-2.5 w-2.5 text-stone-400" />
                  </a>
                </div>

                {/* Downward Flow Connector */}
                <div className="flex items-center justify-center gap-2 py-1.5 select-none">
                  <div className="h-3 w-px bg-stone-300"></div>
                  <span className="text-[10px] font-mono text-stone-400 font-medium">
                    1 master asset → 4 markets → 3 formats
                  </span>
                  <div className="h-3 w-px bg-stone-300"></div>
                </div>

                {/* Sub-header with Format Column Headers Aligned with Thumbnails */}
                <div className="flex items-center justify-between pb-1.5 px-0.5">
                  <span className="text-[11px] font-semibold text-stone-600">
                    4 regional markets × 3 formats
                  </span>
                  <div className="text-[9px] font-mono font-medium text-stone-400 flex items-center gap-4 pr-5">
                    <span>1:1</span>
                    <span>9:16</span>
                    <span>16:9</span>
                  </div>
                </div>

                {/* 4 Rows */}
                <div className="space-y-1.5">
                  {[
                    {
                      name: 'Diwali',
                      badge: 'North',
                      lang: 'Hindi',
                      region: 'North & West',
                      script: 'शुभ दीपावली',
                      font: 'font-devanagari',
                      localeId: 'north_hindi',
                      searchKey: 'diwali',
                    },
                    {
                      name: 'Durga Puja',
                      badge: 'East',
                      lang: 'Bengali',
                      region: 'East',
                      script: 'শুভ শারদীয়া',
                      font: 'font-bengali',
                      localeId: 'east_bengali',
                      searchKey: 'durga',
                    },
                    {
                      name: 'Pongal',
                      badge: 'South',
                      lang: 'Tamil',
                      region: 'South',
                      script: 'இனிய பொங்கல்',
                      font: 'font-tamil',
                      localeId: 'south_tamil',
                      searchKey: 'pongal',
                    },
                    {
                      name: 'Ningol Chakouba',
                      badge: 'Manipur',
                      lang: 'Meitei',
                      region: 'Manipur',
                      script: 'ꯅꯤꯉꯣꯜ ꯆꯥꯛꯀꯧꯕ',
                      font: 'font-meetei',
                      localeId: 'northeast_meitei',
                      searchKey: 'ningol',
                    },
                  ].map((m) => {
                    const v1 = allVariants.find(
                      (v) =>
                        (v.localeId === m.localeId ||
                          v.metadata?.festival?.toLowerCase().includes(m.searchKey)) &&
                        (v.ratioId === '1_1' || v.ratioId === '1:1' || v.metadata?.ratio === '1:1')
                    );
                    const v9 = allVariants.find(
                      (v) =>
                        (v.localeId === m.localeId ||
                          v.metadata?.festival?.toLowerCase().includes(m.searchKey)) &&
                        (v.ratioId === '9_16' || v.ratioId === '9:16' || v.metadata?.ratio === '9:16')
                    );
                    const v16 = allVariants.find(
                      (v) =>
                        (v.localeId === m.localeId ||
                          v.metadata?.festival?.toLowerCase().includes(m.searchKey)) &&
                        (v.ratioId === '16_9' || v.ratioId === '16:9' || v.metadata?.ratio === '16:9')
                    );

                    return (
                      <div
                        key={m.name}
                        className="flex items-center justify-between p-2 rounded-xl border border-stone-200/60 bg-stone-50/40 hover:bg-stone-50/80 transition-all shadow-2xs hover:border-stone-300"
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-stone-900 truncate">
                              {m.name}
                            </span>
                            <span className="text-[9px] font-medium px-1 rounded bg-amber-50 text-amber-800 border border-amber-200/50">
                              {m.badge}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-stone-500 mt-0.5 truncate">
                            <span className={`${m.font} text-stone-600`}>{m.script}</span>
                            <span>·</span>
                            <span className="text-stone-400">{m.lang}</span>
                          </div>
                        </div>

                        {/* 3 Real Thumbnails with clean aspect ratio */}
                        <div className="flex items-center gap-2 shrink-0">
                          {v1 && (
                            <button
                              type="button"
                              onClick={() => setInspectingVariant(v1)}
                              title={`${m.name} · 1:1 Social Feed · Click to inspect`}
                              className="h-7 w-7 rounded-sm overflow-hidden border border-stone-200/80 hover:border-amber-500 hover:ring-1 hover:ring-amber-500/30 shadow-2xs transition-all cursor-pointer bg-stone-100"
                            >
                              <img
                                src={v1.finalUrl || selectedSample.thumbnailUrl}
                                alt="1:1"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = selectedSample.thumbnailUrl;
                                }}
                                className="h-full w-full object-cover"
                              />
                            </button>
                          )}
                          {v9 && (
                            <button
                              type="button"
                              onClick={() => setInspectingVariant(v9)}
                              title={`${m.name} · 9:16 Stories · Click to inspect`}
                              className="h-7 w-4.5 rounded-sm overflow-hidden border border-stone-200/80 hover:border-amber-500 hover:ring-1 hover:ring-amber-500/30 shadow-2xs transition-all cursor-pointer bg-stone-100"
                            >
                              <img
                                src={v9.finalUrl || selectedSample.thumbnailUrl}
                                alt="9:16"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = selectedSample.thumbnailUrl;
                                }}
                                className="h-full w-full object-cover"
                              />
                            </button>
                          )}
                          {v16 && (
                            <button
                              type="button"
                              onClick={() => setInspectingVariant(v16)}
                              title={`${m.name} · 16:9 Display · Click to inspect`}
                              className="h-4.5 w-7 rounded-sm overflow-hidden border border-stone-200/80 hover:border-amber-500 hover:ring-1 hover:ring-amber-500/30 shadow-2xs transition-all cursor-pointer bg-stone-100"
                            >
                              <img
                                src={v16.finalUrl || selectedSample.thumbnailUrl}
                                alt="16:9"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = selectedSample.thumbnailUrl;
                                }}
                                className="h-full w-full object-cover"
                              />
                            </button>
                          )}
                          <ChevronRight className="h-3 w-3 text-stone-300 ml-0.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-100 text-stone-600">
                  <div className="text-[11px] text-stone-500">
                    <span className="font-semibold text-stone-800">12 campaign creatives</span>
                    <span className="mx-1 text-stone-300">·</span>
                    <span>Ready to export</span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                    <span>11 / 12 ready</span>
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* DEDICATED HOW IT WORKS SECTION — Generous whitespace, clean 3-step rhythm */}
      <section id="how-it-works" className="border-b border-stone-200/80 bg-white py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              How PixelPradesh works
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              From one master product asset to a complete 12-creative campaign in three seamless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 01 */}
            <div className="p-6 rounded-2xl border border-stone-200/80 bg-[#fafaf9] shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-display text-xl font-bold text-stone-900">01</span>
                <span className="rounded border border-stone-200/80 bg-white px-2 py-0.5 text-[10px] font-medium text-stone-500 shadow-2xs">
                  Master asset
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-stone-900 pt-1">
                Start with one product image
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Upload a master product photograph and campaign brief, or start from a curated product preset.
              </p>
            </div>

            {/* Step 02 */}
            <div className="p-6 rounded-2xl border border-stone-200/80 bg-[#fafaf9] shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-display text-xl font-bold text-stone-900">02</span>
                <span className="rounded border border-stone-200/80 bg-white px-2 py-0.5 text-[10px] font-medium text-stone-500 shadow-2xs">
                  Regional adaptation
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-stone-900 pt-1">
                Localize across markets
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Adapt the scene, regional context, language, typography, and composition for each target market and format.
              </p>
            </div>

            {/* Step 03 */}
            <div className="p-6 rounded-2xl border border-stone-200/80 bg-[#fafaf9] shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-display text-xl font-bold text-amber-700">03</span>
                <span className="rounded border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-800 shadow-2xs">
                  Full campaign delivery
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-stone-900 pt-1">
                Review and deliver
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Review every localized creative, check layout and safe zones, then export the campaign-ready set.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CAMPAIGN WORKSPACE SECTION */}
      <div id="workspace" className="py-10 bg-[#fafaf9]">
        <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Workspace Intro Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-amber-700 block mb-0.5">
                Product Workspace
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                Campaign workspace
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Generate, inspect, and export localized campaign creatives across 4 markets and 3 formats.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-full px-3 py-1 shadow-2xs">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  readyCount < allVariants.length ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
              ></span>
              <span>
                {readyCount} / {allVariants.length || 12} ready
              </span>
            </div>
          </div>

          {/* Inline Contextual Notification */}
          {notification && (
            <StudioNotification
              type={notification.type}
              message={notification.message}
              onDismiss={() => setNotification(null)}
            />
          )}

          {/* Campaign Setup Area (Clean, Editorial Form & Preset Showcase) */}
          <section aria-label="Campaign Setup">
            <MasterAssetDock
              selectedSample={selectedSample}
              onSelectSample={handleSelectSample}
              customUrl={customUrl}
              onCustomUrlChange={setCustomUrl}
              onFileUploaded={handleFileUploaded}
              onClearCustom={handleClearCustom}
              productName={productName}
              onProductNameChange={setProductName}
              brief={brief}
              onBriefChange={setBrief}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
              onError={(msg) => setNotification({ type: 'error', message: msg })}
              readyCount={readyCount}
              totalVariantsCount={allVariants.length}
            />
          </section>

          {/* Filter & Batch Export Bar */}
          <section aria-label="Filter and Export Controls">
            <SearchFilterBar
              jobId={currentJob?.id || ''}
              totalVariantsCount={allVariants.length}
              readyVariantsCount={readyCount}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedFestival={selectedFestival}
              onFestivalChange={setSelectedFestival}
              selectedChannel={selectedChannel}
              onChannelChange={setSelectedChannel}
              onExportSuccess={() =>
                setNotification({
                  type: 'success',
                  message: '12 localized campaign creatives packaged into ZIP archive.',
                })
              }
            />
          </section>

          {/* Campaign Matrix (Centerpiece Creative Contact Sheet) */}
          <section
            id="campaign-creatives"
            className="scroll-mt-20"
            aria-label="Localized Creative Matrix"
          >
            <CampaignMatrix
              variants={filteredVariants}
              isGenerating={isGenerating}
              onInspectVariant={(v) => setInspectingVariant(v)}
            />
          </section>
        </main>
      </div>

      {/* Studio Lightbox Modal */}
      <StudioLightbox
        variant={inspectingVariant}
        allVariants={allVariants}
        masterUrl={currentJob?.masterUrl || selectedSample.thumbnailUrl}
        onClose={() => setInspectingVariant(null)}
        onSelectVariant={(v) => setInspectingVariant(v)}
        onRegenerate={handleRegenerateVariant}
      />

      {/* Editorial Product Footer */}
      <footer className="mt-20 border-t border-stone-200 bg-white py-8 text-xs text-stone-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <AdaptrLogo size={20} />
            <span className="font-display font-bold text-stone-900 text-sm">PixelPradesh</span>
            <span className="text-stone-300">·</span>
            <span>Autonomous Regional Media Localization Engine</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a href="#how-it-works" className="text-stone-600 hover:text-stone-900 transition-colors">
              How it works
            </a>
            <span className="text-stone-300">·</span>
            <a href="#workspace" className="text-stone-600 hover:text-stone-900 transition-colors">
              Campaign workspace
            </a>
            <span className="text-stone-300">·</span>
            <span className="text-stone-400">Powered by Cloudinary</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
