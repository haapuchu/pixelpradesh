'use client';

import React, { useState } from 'react';
import { AdVariant } from '@/types/job';
import { X, Copy, Check, Terminal, ExternalLink, Code2 } from 'lucide-react';

interface RecipeCodeModalProps {
  variant: AdVariant;
  onClose: () => void;
}

export const RecipeCodeModal: React.FC<RecipeCodeModalProps> = ({ variant, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(variant.recipeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Split recipe segments for structured viewing
  const segments = variant.recipeUrl.split('/image/upload/')[1]?.split('/') || [];
  const transformationChain = segments.slice(0, -1).join(' / ');
  const publicIdWithExt = segments[segments.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl border border-stone-200/90 bg-white shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20 shadow-2xs">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Cloudinary Transformation Recipe
              </h3>
              <p className="text-xs text-stone-500">
                {variant.metadata.festival} · {variant.metadata.ratio} Channel Fit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-amber-600" />
                Deterministic Cloudinary Delivery URL
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-amber-800 hover:text-amber-900 font-semibold transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied URL!' : 'Copy URL'}</span>
              </button>
            </div>
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 font-mono text-xs text-amber-950 break-all select-all shadow-2xs">
              {variant.recipeUrl}
            </div>
            {transformationChain && (
              <div className="mt-2 text-[11px] font-mono text-stone-600 bg-stone-100/70 p-2 rounded-lg border border-stone-200">
                <span className="text-stone-500 font-semibold">Transform Chain: </span>
                <span className="text-amber-900">{transformationChain}</span>
                <span className="text-stone-400"> · Target: </span>
                <span className="text-emerald-700 font-semibold">{publicIdWithExt}</span>
              </div>
            )}
          </div>

          {/* Step Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Pipeline Stage Breakdown
            </h4>
            <div className="grid gap-2 text-xs">
              <div className="rounded-lg border border-stone-200 bg-stone-50/70 p-2.5 flex items-start justify-between">
                <div>
                  <span className="font-semibold text-stone-900">1. Generative Background:</span>
                  <p className="text-stone-500 text-[11px] mt-0.5">
                    <code>e_gen_background_replace:prompt_...</code> replaces raw studio background with authentic festive decor.
                  </p>
                </div>
              </div>
              <div className="rounded-lg border border-stone-200 bg-stone-50/70 p-2.5 flex items-start justify-between">
                <div>
                  <span className="font-semibold text-stone-900">2. Generative Aspect Outpaint:</span>
                  <p className="text-stone-500 text-[11px] mt-0.5">
                    <code>c_pad,ar_{variant.metadata.ratio},b_gen_fill</code> outpaints missing borders without stretching the product.
                  </p>
                </div>
              </div>
              <div className="rounded-lg border border-stone-200 bg-stone-50/70 p-2.5 flex items-start justify-between">
                <div>
                  <span className="font-semibold text-stone-900">3. Custom Indic Script Overlay:</span>
                  <p className="text-stone-500 text-[11px] mt-0.5">
                    <code>l_text:{variant.metadata.script}_bold:...</code> overlays cultural headline and CTA within safe zones.
                  </p>
                </div>
              </div>
              <div className="rounded-lg border border-stone-200 bg-stone-50/70 p-2.5 flex items-start justify-between">
                <div>
                  <span className="font-semibold text-emerald-800">4. Edge Delivery Optimization:</span>
                  <p className="text-stone-500 text-[11px] mt-0.5">
                    <code>f_auto/q_auto</code> delivers optimal modern WebP/AVIF format and compression at the edge.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-stone-100">
          <a
            href={variant.finalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors shadow-2xs"
          >
            <span>Open in Tab</span>
            <ExternalLink className="h-3.5 w-3.5 text-stone-400" />
          </a>
          <button
            onClick={onClose}
            className="saffron-btn rounded-xl px-5 py-2 text-xs font-bold text-white shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
