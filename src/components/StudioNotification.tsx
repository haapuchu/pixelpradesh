'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export type NotificationType = 'error' | 'success' | 'info';

export interface StudioNotificationProps {
  type: NotificationType;
  message: string;
  onDismiss: () => void;
}

export const StudioNotification: React.FC<StudioNotificationProps> = ({
  type,
  message,
  onDismiss,
}) => {
  const styles = {
    error: 'border-rose-200 bg-rose-50 text-rose-900 shadow-xs',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900 shadow-xs',
    info: 'border-amber-200 bg-amber-50 text-amber-900 shadow-xs',
  };

  const icons = {
    error: <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />,
    success: <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />,
    info: <Info className="h-4 w-4 shrink-0 text-amber-600" />,
  };

  return (
    <div
      role="alert"
      className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-xs font-medium transition-all ${styles[type]}`}
    >
      <div className="flex items-center gap-2.5">
        {icons[type]}
        <span>{message}</span>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="tactile-btn rounded-lg p-1 text-stone-500 hover:bg-black/5 hover:text-stone-900 transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
