'use client';

import React, { useState } from 'react';
import { Search, Download, RefreshCw, Check } from 'lucide-react';

interface SearchFilterBarProps {
  jobId: string;
  totalVariantsCount: number;
  readyVariantsCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedFestival: string;
  onFestivalChange: (fest: string) => void;
  selectedChannel: string;
  onChannelChange: (channel: string) => void;
  onExportSuccess?: () => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  jobId,
  searchQuery,
  onSearchChange,
  selectedFestival,
  onFestivalChange,
  selectedChannel,
  onChannelChange,
  onExportSuccess,
}) => {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportDone, setExportDone] = useState<boolean>(false);

  const handleExportZip = async () => {
    if (!jobId) return;
    setIsExporting(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}/export`);
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PixelPradesh_Campaign_12_Creatives.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setExportDone(true);
      setTimeout(() => setExportDone(false), 3000);
      if (onExportSuccess) onExportSuccess();
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const festivals = [
    { id: 'all', label: 'All markets' },
    { id: 'diwali', label: 'Diwali (North)' },
    { id: 'durga puja', label: 'Durga Puja (East)' },
    { id: 'pongal', label: 'Pongal (South)' },
    { id: 'ningol chakouba', label: 'Ningol Chakouba (Northeast)' },
  ];

  const channels = [
    { id: 'all', label: 'All formats' },
    { id: '1_1', label: '1:1 Feed' },
    { id: '9_16', label: '9:16 Stories' },
    { id: '16_9', label: '16:9 Display' },
  ];

  return (
    <div className="editorial-surface rounded-2xl p-3.5 sm:p-4 bg-white">
      <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input with clean editorial styling */}
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search campaign creatives..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-stone-50/50 py-2.5 sm:py-2 pl-9 pr-9 text-base sm:text-xs text-stone-900 placeholder-stone-400 transition-all focus:border-stone-800 focus:bg-white focus:outline-none focus:ring-0 shadow-2xs"
          />
          <kbd className="hidden sm:inline absolute right-3 top-1/2 -translate-y-1/2 rounded border border-stone-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-stone-400 shadow-2xs">
            /
          </kbd>
        </div>

        {/* Format, Market & Export Controls */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
          {/* Format Select */}
          <div className="relative col-span-1">
            <select
              value={selectedChannel}
              onChange={(e) => onChannelChange(e.target.value)}
              className="w-full appearance-none rounded-xl border border-stone-200 bg-stone-50/70 py-2.5 sm:py-2 pl-3 pr-7 text-xs font-medium text-stone-700 hover:bg-stone-100 hover:border-stone-300 transition-colors focus:border-stone-900 focus:outline-none cursor-pointer min-h-[42px] sm:min-h-0"
            >
              {channels.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-[10px]">
              ▾
            </div>
          </div>

          {/* Market Select */}
          <div className="relative col-span-1">
            <select
              value={selectedFestival}
              onChange={(e) => onFestivalChange(e.target.value)}
              className="w-full appearance-none rounded-xl border border-stone-200 bg-stone-50/70 py-2.5 sm:py-2 pl-3 pr-7 text-xs font-medium text-stone-700 hover:bg-stone-100 hover:border-stone-300 transition-colors focus:border-stone-900 focus:outline-none cursor-pointer min-h-[42px] sm:min-h-0"
            >
              {festivals.map((fest) => (
                <option key={fest.id} value={fest.id}>
                  {fest.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-[10px]">
              ▾
            </div>
          </div>

          {/* Batch Export Button */}
          <button
            onClick={handleExportZip}
            disabled={isExporting}
            className="tactile-btn col-span-2 sm:col-span-1 flex items-center justify-center gap-2 rounded-xl bg-stone-900 text-white px-4 py-2.5 sm:py-2 text-xs font-semibold hover:bg-stone-800 transition-all disabled:opacity-50 shrink-0 shadow-2xs min-h-[44px] sm:min-h-0 cursor-pointer"
          >
            {isExporting ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-white" />
                <span>Exporting...</span>
              </>
            ) : exportDone ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-200">Exported</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5 text-stone-300" />
                <span>Export campaign</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
