'use client';

import React, { useState, useRef } from 'react';
import { SAMPLE_PRODUCTS, SampleProduct } from '@/config/samples.config';
import {
  Image as ImageIcon,
  CheckCircle2,
  UploadCloud,
  X,
  Link as LinkIcon,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export interface UploadedFileMetadata {
  url: string;
  publicId: string;
  fileName?: string;
  isLiveCloudinary?: boolean;
  name?: string;
  category?: string;
  brief?: string;
  cta?: string;
}

interface HeroUploaderProps {
  selectedSample: SampleProduct;
  onSelectSample: (sample: SampleProduct) => void;
  customUrl: string;
  onCustomUrlChange: (url: string) => void;
  onFileUploaded?: (meta: UploadedFileMetadata) => void;
  onClearCustom?: () => void;
}

export const HeroUploader: React.FC<HeroUploaderProps> = ({
  selectedSample,
  onSelectSample,
  customUrl,
  onCustomUrlChange,
  onFileUploaded,
  onClearCustom,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'upload'>('presets');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadedFileMetadata | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload via /api/upload
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPEG, WebP).');
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

        setUploadStatus(meta);
        onCustomUrlChange(data.url);
        if (onFileUploaded) {
          onFileUploaded(meta);
        }
      } else {
        alert(data.error || 'Failed to process image upload.');
      }
    } catch (err) {
      console.error('File upload error:', err);
      alert('Upload failed. Check server console.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setUploadStatus(null);
    onCustomUrlChange('');
    if (onClearCustom) onClearCustom();
  };

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-800">
      {/* Top Header & Tab Controls */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-amber-400" />
            1. Select Master Hero Shot
          </h2>
          <p className="text-xs text-slate-400">
            Choose a demo festive product or upload your own real product photo.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-slate-800 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab('presets');
              handleClear();
            }}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              activeTab === 'presets'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            4 Demo Presets
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              activeTab === 'upload'
                ? 'bg-rose-600/90 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UploadCloud className="h-3.5 w-3.5" />
            <span>Upload Real Image</span>
          </button>
        </div>
      </div>

      {activeTab === 'upload' ? (
        /* Real Image Upload Workspace */
        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            onChange={handleFileChange}
            className="hidden"
          />

          {!customUrl ? (
            /* Drag and Drop Dropzone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
                isDragging
                  ? 'border-rose-500 bg-rose-500/10 scale-[1.01]'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950/90'
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
                  <p className="text-xs font-semibold text-slate-200">
                    Processing Image & Uploading to Cloudinary...
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">Running quality & safe-zone analysis</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <UploadCloud className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">
                      Drop your real product photo here, or{' '}
                      <span className="text-rose-400 underline decoration-rose-500/50">browse files</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Supports PNG, JPG, WebP, AVIF up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Uploaded Image Active State */
            <div className="relative rounded-2xl border border-slate-700 bg-slate-950 p-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
                  <img src={customUrl} alt="Uploaded product" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h4 className="text-xs font-bold text-white truncate">
                      {uploadStatus?.fileName || 'Custom Product Hero'}
                    </h4>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      Loaded
                    </span>
                  </div>

                  {/* Cloudinary Live Connection Badge */}
                  <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px]">
                    {uploadStatus?.isLiveCloudinary ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-mono bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800">
                        <Zap className="h-3 w-3 text-emerald-400" />
                        Uploaded to Cloudinary: {uploadStatus.publicId}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-300 font-mono bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/80">
                        <ShieldCheck className="h-3 w-3 text-amber-400" />
                        Demo Mode: Direct Preview Ready
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-[11px] text-slate-400">
                    Ready to generate 12 regional festival variations across Hindi, Bengali, Tamil, and Meitei.
                  </p>
                </div>

                {/* Remove / Change */}
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-400 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-300 transition-colors"
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Collapsible URL Input fallback */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-[11px] font-medium text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
            >
              <LinkIcon className="h-3 w-3" />
              <span>{showUrlInput ? 'Hide public URL paste option' : 'Or paste a public image URL'}</span>
            </button>

            {showUrlInput && (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="https://example.com/my-product-shot.jpg"
                  value={customUrl}
                  onChange={(e) => {
                    onCustomUrlChange(e.target.value);
                    setUploadStatus({
                      url: e.target.value,
                      publicId: `url_upload_${Date.now()}`,
                      fileName: 'Remote Image Asset',
                      isLiveCloudinary: false,
                    });
                  }}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Presets Grid */
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SAMPLE_PRODUCTS.map((product) => {
            const isSelected = selectedSample.id === product.id && !customUrl;
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => {
                  handleClear();
                  onSelectSample(product);
                }}
                className={`group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-amber-400/80 bg-slate-800/80 ring-2 ring-amber-400/30'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                {/* Thumbnail */}
                <div className="relative aspect-square w-full overflow-hidden bg-slate-950">
                  <img
                    src={product.thumbnailUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {isSelected && (
                    <div className="absolute right-2 top-2 rounded-full bg-amber-500 p-1 text-slate-950 shadow-md">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                  )}
                  <span className="absolute bottom-2 left-2 rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] font-medium text-slate-300 backdrop-blur-sm">
                    {product.category.split('&')[0]}
                  </span>
                </div>

                {/* Details */}
                <div className="p-2.5">
                  <h4 className="line-clamp-1 text-xs font-semibold text-slate-200 group-hover:text-white">
                    {product.name}
                  </h4>
                  <p className="line-clamp-1 mt-0.5 text-[11px] text-slate-400">
                    {product.defaultBrief}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
