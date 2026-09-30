'use client';

import React from 'react';
import { X, ShieldCheck, Cpu, Layers, Sparkles, CheckCircle2 } from 'lucide-react';

interface JudgeNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JudgeNoticeModal: React.FC<JudgeNoticeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-white border border-stone-200 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-amber-50 text-amber-900 border border-amber-200">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-700" />
              <span>Cloudinary AI Hackathon 2026</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-stone-900 font-display">
              Judge Evaluation & Architecture Transparency
            </h2>
            <p className="text-xs text-stone-500">
              PixelPradesh · Built by Team Lotux (Track 2 & Track 3)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Core Rationale */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
            <Cpu className="h-4 w-4 text-blue-600 shrink-0" />
            <span>Why is this live deployment in Interactive Demo Mode?</span>
          </div>
          <p className="text-xs text-blue-950 leading-relaxed">
            During public hackathon evaluation, simultaneous multi-user requests executing heavy generative transformations (<code className="px-1.5 py-0.5 rounded bg-blue-100/90 text-blue-900 font-mono text-[11px]">e_gen_background_replace</code> and <code className="px-1.5 py-0.5 rounded bg-blue-100/90 text-blue-900 font-mono text-[11px]">b_gen_fill</code>) can cause 15–25 second latency queues, rate-limit throttling, or credit depletion. To give judges a <strong className="font-semibold text-blue-900">zero-latency, deterministic, and friction-free review</strong>, this deployment serves pre-calibrated high-fidelity variants.
          </p>
        </div>

        {/* Cloudinary Integration Points */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-stone-600" />
            <span>Active Cloudinary Engine Implementation</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-lg border border-stone-200 bg-stone-50/60 space-y-1">
              <span className="font-semibold text-stone-900 font-mono text-[11px]">e_gen_background_replace</span>
              <p className="text-[11px] text-stone-600 leading-normal">
                Isolates the merchandise silhouette and generates culturally authentic festive backdrops (brass diyas, dhunuchi smoke, lotus blooms).
              </p>
            </div>

            <div className="p-3 rounded-lg border border-stone-200 bg-stone-50/60 space-y-1">
              <span className="font-semibold text-stone-900 font-mono text-[11px]">c_pad, b_gen_fill</span>
              <p className="text-[11px] text-stone-600 leading-normal">
                Outpaints horizontal and vertical canvas space across 1:1, 9:16, and 16:9 formats without distorting product packaging geometry.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-stone-200 bg-stone-50/60 space-y-1">
              <span className="font-semibold text-stone-900 font-mono text-[11px]">l_text Unicode Overlays</span>
              <p className="text-[11px] text-stone-600 leading-normal">
                Composites native Indic scripts (Devanagari, Bengali, Tamil, Meitei Mayek) precisely positioned within channel safe margins.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-stone-200 bg-stone-50/60 space-y-1">
              <span className="font-semibold text-stone-900 font-mono text-[11px]">colors: true, fl_getinfo</span>
              <p className="text-[11px] text-stone-600 leading-normal">
                Extracts dominant brand color palettes and runs contrast verification for automated brand safety and WCAG compliance.
              </p>
            </div>
          </div>
        </div>

        {/* How to inspect recipes */}
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
            <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
            <span>How to verify the real Cloudinary transformation recipes:</span>
          </div>
          <ol className="list-decimal list-inside text-xs text-stone-600 space-y-1 leading-relaxed">
            <li>Click on any generated creative in the <strong className="font-semibold text-stone-800">Campaign Creatives Matrix</strong>.</li>
            <li>In the <strong className="font-semibold text-stone-800">Review Studio Lightbox</strong>, scroll down on the right panel and expand <strong className="font-semibold text-stone-800">Technical Details</strong>.</li>
            <li>Every creative reveals its exact, reproducible, and edge-executable Cloudinary URL recipe.</li>
          </ol>
        </div>

        {/* Live execution note */}
        <div className="text-[11px] text-stone-500 border-t border-stone-100 pt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span>Source: <a href="https://github.com/haapuchu/pixelpradesh" target="_blank" rel="noreferrer" className="underline font-medium text-stone-700 hover:text-stone-900">GitHub</a></span>
            <span>·</span>
            <span><a href="https://youtu.be/mgdr_7HrOUQ" target="_blank" rel="noreferrer" className="underline font-medium text-red-600 hover:text-red-700">Watch YouTube Demo</a></span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Got it, continue testing
          </button>
        </div>
      </div>
    </div>
  );
};
