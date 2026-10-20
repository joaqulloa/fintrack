"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "Algo salió mal",
  description = "No pudimos cargar la información. Intenta nuevamente.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-100 bg-rose-50/50 px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-500">
        <AlertTriangle size={26} strokeWidth={1.8} />
      </div>

      <h3 className="mt-4 text-base font-bold text-slate-900">{title}</h3>

      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <RotateCcw size={16} />
          Reintentar
        </button>
      )}
    </div>
  );
}
