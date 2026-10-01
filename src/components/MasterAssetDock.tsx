'use client';

import React, { useRef, useState } from 'react';
import { SAMPLE_PRODUCTS, SampleProduct } from '@/config/samples.config';
import { Upload, Sparkles, RefreshCw, X, Check, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { UploadedFileMetadata } from './HeroUploader';

interface MasterAssetDockProps {
  selectedSample: SampleProduct;
  onSelectSample: (sample: SampleProduct) => void;
  customUrl: string;
  onCustomUrlChange: (url: string) => void;
  onFileUploaded: (meta: UploadedFileMetadata) => void;
  onClearCustom: () => void;
  productName: string;
  onProductNameChange: (val: string) => void;
  brief: string;
  onBriefChange: (val: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  onError: (msg: string) => void;
  readyCount?: number;
  totalVariantsCount?: number;
}

export const MasterAssetDock: React.FC<MasterAssetDockProps> = ({
  selectedSample,
  onSelectSample,
  customUrl,
  onCustomUrlChange,
  onFileUploaded,
  onClearCustom,
  productName,
  onProductNameChange,
  brief,
  onBriefChange,
  isGenerating,
  onGenerate,
  onError,
  readyCount = 12,
  totalVariantsCount = 12,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const activeImageUrl = customUrl || selectedSample.thumbnailUrl;
  const isCustom = Boolean(customUrl);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      onError('Invalid file format. Please upload an image (PNG, JPEG, or WebP).');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        const meta: UploadedFileMetadata = {
          url: data.url,
          publicId: data.publicId,
          fileName: data.fileName || file.name,
          isLiveCloudinary: data.isLiveCloudinary,
          name: data.name,
          category: data.category,
          brief: data.brief,
          cta: data.cta,
        };

        onCustomUrlChange(data.url);
        onFileUploaded(meta);
      } else {
        onError(data.error || 'Failed to upload product asset.');
      }
    } catch (err) {
      console.error(err);
      onError('Upload failed. Please check network connection.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="editorial-surface rounded-2xl p-4 sm:p-7 bg-white shadow-xs">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
      />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-5 mb-5 sm:mb-6 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-stone-700" />
            <h2 className="font-display text-base font-bold tracking-tight text-stone-900">
              Campaign setup
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Select a curated product example or upload a master photograph to generate your multi-format campaign.
          </p>
        </div>

        {/* Upload & Preset state controls */}
        <div className="flex items-center gap-2">
          {isCustom ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                Custom asset
              </span>
              <button
                onClick={onClearCustom}
                className="tactile-btn flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-xs text-stone-600 hover:text-stone-900 hover:border-stone-300 min-h-[38px] sm:min-h-0"
              >
                <X className="h-3 w-3" />
                <span>Reset to presets</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="tactile-btn inline-flex items-center justify-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 sm:py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100 hover:border-stone-300 transition-colors w-full sm:w-auto min-h-[44px] sm:min-h-0 cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5 text-stone-500" />
              <span>{isUploading ? 'Uploading...' : 'Upload product photo'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 3-Column Architectural Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left Column: Master Product Image & Curated Presets (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Product Frame / Drop Target */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`group relative flex items-center gap-3.5 rounded-xl border p-3 bg-stone-50/70 transition-all ${
              isDragging
                ? 'border-amber-500 bg-amber-50/40'
                : 'border-stone-200/80 hover:border-stone-300'
            }`}
          >
            {/* Visual Thumbnail */}
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-2xs">
              <img
                src={activeImageUrl}
                alt={productName}
                className="h-full w-full object-cover"
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs">
                  <RefreshCw className="h-4 w-4 animate-spin text-white" />
                </div>
              )}
              <div className="absolute bottom-1 right-1 rounded bg-stone-900/80 px-1 py-0.5 text-[9px] font-mono text-white">
                MASTER
              </div>
            </div>

            {/* Product details */}
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-semibold text-amber-700 block truncate">
                {selectedSample.category}
              </span>
              <h3 className="font-display text-xs font-bold text-stone-900 truncate mt-0.5">
                {productName}
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-snug line-clamp-2">
                {isCustom
                  ? 'Custom product photo calibrated for regional localization.'
                  : 'Artisanal product pre-calibrated for festive campaigns.'}
              </p>
            </div>
          </div>

          {/* Curated Product Presets - Collapsible Secondary Control */}
          <div className="pt-0.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Preset product
              </span>
              <button
                type="button"
                onClick={() => setShowPresets((prev) => !prev)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-stone-700 hover:text-stone-900 transition-colors"
              >
                <span>{showPresets ? 'Hide presets' : 'Change product'}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-stone-400 transition-transform duration-200 ${
                    showPresets ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {showPresets && (
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-stone-200/70 transition-all">
                {SAMPLE_PRODUCTS.map((p) => {
                  const isActive = !isCustom && selectedSample.id === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        if (isCustom) onClearCustom();
                        onSelectSample(p);
                      }}
                      className={`tactile-btn flex items-center gap-2 rounded-lg border p-2 text-left transition-all ${
                        isActive
                          ? 'border-stone-900 bg-stone-900 text-white shadow-2xs'
                          : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50 text-stone-800'
                      }`}
                    >
                      <img
                        src={p.thumbnailUrl}
                        alt={p.name}
                        className="h-8 w-8 rounded object-cover border border-stone-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span
                          className={`text-[11px] font-bold truncate block ${
                            isActive ? 'text-white' : 'text-stone-900'
                          }`}
                        >
                          {p.name.split(' ')[0]} {p.name.split(' ')[1] || ''}
                        </span>
                        <span
                          className={`text-[10px] truncate block ${
                            isActive ? 'text-stone-300' : 'text-stone-500'
                          }`}
                        >
                          {p.category.split('&')[0]}
                        </span>
                      </div>
                      {isActive && (
                        <Check className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Center Column: Product Name, Brief, Markets & Formats (5 cols) */}
        <div className="lg:col-span-5 space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Product name
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => onProductNameChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (!isGenerating && !isUploading) {
                    onGenerate();
                    const el = document.getElementById('campaign-creatives');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }
              }}
              className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3 py-2.5 sm:py-2 text-base sm:text-xs text-stone-900 placeholder-stone-400 transition-all focus:border-stone-800 focus:bg-white focus:outline-none focus:ring-0 shadow-2xs"
              placeholder="e.g. Haldiram's Royal Kaju Katli"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Campaign brief
            </label>
            <textarea
              rows={2}
              value={brief}
              onChange={(e) => onBriefChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  if (!isGenerating && !isUploading) {
                    onGenerate();
                    const el = document.getElementById('campaign-creatives');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }
              }}
              className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50/50 p-2.5 text-base sm:text-xs leading-relaxed text-stone-900 placeholder-stone-400 transition-all focus:border-stone-800 focus:bg-white focus:outline-none focus:ring-0 shadow-2xs"
              placeholder="Provide festive context, cultural motifs, or seasonal messaging..."
            />
          </div>

          {/* Markets & Formats Selection Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <span className="text-[11px] font-semibold text-stone-600 block mb-1">
                Regional markets (4)
              </span>
              <div className="space-y-1">
                <span className="inline-block rounded-md border border-stone-200 bg-stone-50 px-2 py-0.5 text-[11px] text-stone-700 font-medium mr-1 mb-1">
                  Diwali (Hindi)
                </span>
                <span className="inline-block rounded-md border border-stone-200 bg-stone-50 px-2 py-0.5 text-[11px] text-stone-700 font-medium mr-1 mb-1">
                  Durga Puja (Bengali)
                </span>
                <span className="inline-block rounded-md border border-stone-200 bg-stone-50 px-2 py-0.5 text-[11px] text-stone-700 font-medium mr-1 mb-1">
                  Pongal (Tamil)
                </span>
                <span className="inline-block rounded-md border border-stone-200 bg-stone-50 px-2 py-0.5 text-[11px] text-stone-700 font-medium mr-1 mb-1">
                  Ningol Chakouba (Meitei)
                </span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-stone-600 block mb-1">
                Channel formats (3)
              </span>
              <div className="space-y-1">
                <span className="inline-block rounded-md border border-stone-200 bg-stone-50 px-2 py-0.5 text-[11px] text-stone-700 font-medium mr-1 mb-1">
                  1:1 Feed
                </span>
                <span className="inline-block rounded-md border border-stone-200 bg-stone-50 px-2 py-0.5 text-[11px] text-stone-700 font-medium mr-1 mb-1">
                  9:16 Stories
                </span>
                <span className="inline-block rounded-md border border-stone-200 bg-stone-50 px-2 py-0.5 text-[11px] text-stone-700 font-medium mr-1 mb-1">
                  16:9 Display
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Concise Summary & Primary Action (3 cols) */}
        <div className="lg:col-span-3 flex flex-col justify-between rounded-xl border border-stone-200/90 bg-stone-50/60 p-5 h-full space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200/60">
              <span className="text-xs font-bold text-stone-900">
                Campaign output
              </span>
              {isGenerating ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-medium text-amber-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  Generating
                </span>
              ) : totalVariantsCount > 0 ? (
                readyCount < totalVariantsCount ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-medium text-amber-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                    {readyCount} / {totalVariantsCount} ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-medium text-emerald-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    Ready
                  </span>
                )
              ) : null}
            </div>

            <div className="rounded-lg border border-stone-200/80 bg-white p-3 space-y-1">
              <div className="font-display text-base font-bold text-stone-900 leading-tight">
                12 creatives
              </div>
              <div className="text-xs text-stone-500">
                4 markets · 3 formats
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="space-y-2">
            <button
              onClick={() => {
                onGenerate();
                const el = document.getElementById('campaign-creatives');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              disabled={isGenerating || isUploading}
              className="saffron-btn flex w-full items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-white" />
                  <span>Generating campaign...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>Generate campaign</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-stone-400 text-center">
              Generates full multi-channel asset flight
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
