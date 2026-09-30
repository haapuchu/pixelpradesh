'use client';

import React, { useState } from 'react';
import { AdVariant } from '@/types/job';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { RecipeCodeModal } from './RecipeCodeModal';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Code2,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface InspectorDrawerProps {
  variant: AdVariant | null;
  masterUrl: string;
  onClose: () => void;
  onRegenerate: (variantId: string) => Promise<void>;
}

export const InspectorDrawer: React.FC<InspectorDrawerProps> = ({
  variant,
  masterUrl,
  onClose,
  onRegenerate,
}) => {
  const [showRecipeModal, setShowRecipeModal] = useState<boolean>(false);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);

  if (!variant) return null;

  const isFlagged = variant.status === 'FLAGGED';

  const handleRegenerateClick = async () => {
    setIsRegenerating(true);
    try {
      await onRegenerate(variant.id);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-stone-900/60 backdrop-blur-sm animate-fadeIn" onClick={onClose} />

      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-stone-200 bg-white shadow-2xl transition-all duration-300">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span
              className="h-3 w-3 rounded-full ring-2 ring-stone-900/10 shadow-2xs"
              style={{ backgroundColor: variant.metadata.accentColor }}
            />
            <div>
              <h2 className="text-sm font-bold text-stone-900">
                {variant.metadata.festival} Ad Variant Inspector
              </h2>
              <p className="text-xs text-stone-500">
                {variant.metadata.locale} · {variant.metadata.ratio} Channel Fit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-900 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Flagged Alert Banner */}
          {isFlagged && (
            <div className="rounded-xl border border-amber-300 bg-amber-50/90 p-4">
              <div className="flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-amber-900">
                    Compliance Gate Notice: Safe Margin Warning
                  </h4>
                  <p className="text-xs text-amber-800/90 mt-1">
                    {variant.complianceResults.find((r) => !r.passed)?.reason ||
                      'Headline text boundary sits within 14px of top display border.'}
                  </p>
                  <button
                    onClick={handleRegenerateClick}
                    disabled={isRegenerating}
                    className="saffron-btn mt-3 flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                    <span>{isRegenerating ? 'Regenerating...' : 'Self-Heal with Adjusted Safe Margins'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 1. Interactive Before/After Split Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                Interactive Before / After Staging
              </h3>
              <span className="text-[11px] text-stone-400">Drag slider horizontally</span>
            </div>
            <BeforeAfterSlider
              masterUrl={masterUrl}
              variantUrl={variant.finalUrl}
              ratio={variant.metadata.ratio || variant.ratioId}
            />
          </div>

          {/* 2. Recipe Code Callout */}
          <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50/70 p-3.5">
            <div>
              <p className="text-xs font-semibold text-stone-900">Cloudinary Transformation Recipe</p>
              <p className="text-[11px] text-stone-500 font-mono truncate max-w-xs mt-0.5">
                {variant.recipeUrl.split('/image/upload/')[1] || 'e_gen_background_replace...'}
              </p>
            </div>
            <button
              onClick={() => setShowRecipeModal(true)}
              className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition-colors shadow-2xs"
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Inspect Recipe</span>
            </button>
          </div>

          {/* 3. Stage-by-Stage Timeline */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-600" />
              State Machine Execution Timeline ({variant.stepLogs.length} Stages)
            </h3>
            <div className="space-y-3">
              {variant.stepLogs.map((log, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-stone-200 bg-stone-50/70 p-3 flex items-start gap-3"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-200 text-[11px] font-bold text-stone-700">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-stone-900">{log.stageName}</p>
                      <span className="font-mono text-[10px] text-stone-500">{log.durationMs}ms</span>
                    </div>
                    <p className="text-[11px] font-mono text-stone-500 truncate mt-0.5">
                      {log.url}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Compliance Gate Checklist */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Brand & Visual Compliance Report
            </h3>
            <div className="divide-y divide-stone-200 rounded-xl border border-stone-200 bg-stone-50/70">
              {variant.complianceResults.map((rule) => (
                <div key={rule.ruleId} className="flex items-start gap-3 p-3 text-xs">
                  {rule.passed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-900">{rule.ruleName}</span>
                      <span
                        className={`font-mono text-[11px] font-bold ${
                          rule.passed ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {Math.round(rule.score * 100)}%
                      </span>
                    </div>
                    {rule.reason && (
                      <p className="mt-0.5 text-[11px] text-stone-500">{rule.reason}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="border-t border-stone-100 p-4 bg-white flex items-center justify-between">
          <a
            href={variant.finalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
          >
            <span>Direct CDN Stream</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <button
            onClick={onClose}
            className="saffron-btn rounded-xl px-5 py-2 text-xs font-bold text-white shadow-xs"
          >
            Done
          </button>
        </div>
      </aside>

      {/* Recipe Modal */}
      {showRecipeModal && (
        <RecipeCodeModal variant={variant} onClose={() => setShowRecipeModal(false)} />
      )}
    </>
  );
};
