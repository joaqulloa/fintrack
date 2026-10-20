import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { formatCurrency } from "@/lib/utils/format";

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  color: "blue" | "green" | "red";
  change?: number;
  description: string;
}

const styles = {
  blue: {
    icon: "bg-blue-50 text-blue-600",
  },
  green: {
    icon: "bg-emerald-50 text-emerald-600",
  },
  red: {
    icon: "bg-rose-50 text-rose-600",
  },
};

export default function SummaryCard({
  title,
  amount,
  icon: Icon,
  color,
  change,
  description,
}: SummaryCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100/50">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles[color].icon}`}
        >
          <Icon size={20} strokeWidth={1.8} />
        </div>
      </div>

      <p className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {formatCurrency(amount)}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        {change !== undefined && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 font-semibold ${
              change >= 0
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {change >= 0 ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}
            {Math.abs(change)}%
          </span>
        )}

        <span className="text-slate-500">{description}</span>
      </div>
    </article>
  );
}