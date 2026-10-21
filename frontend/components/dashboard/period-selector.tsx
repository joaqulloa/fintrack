"use client";

import { useRouter } from "next/navigation";
import { CalendarDays } from "lucide-react";

import Select from "@/components/ui/select";
import { MONTH_NAMES, type Period } from "@/lib/utils/period";

interface PeriodSelectorProps {
  period: Period;
  years: number[];
}

export default function PeriodSelector({ period, years }: PeriodSelectorProps) {
  const router = useRouter();

  const navigate = (next: Period) => {
    router.push(`/?month=${next.month}&year=${next.year}`, { scroll: false });
  };

  const monthOptions = MONTH_NAMES.map((name, index) => ({
    value: String(index + 1),
    label: name,
  }));

  const yearOptions = years.map((year) => ({
    value: String(year),
    label: String(year),
  }));

  return (
    <div className="flex flex-wrap items-center gap-3 self-start rounded-2xl border border-slate-200 bg-white p-3 shadow-sm shadow-slate-100/50">
      <span className="inline-flex items-center gap-2 pl-1 text-sm font-medium text-slate-500">
        <CalendarDays size={16} className="text-slate-400" />
        Período
      </span>

      <div className="w-40">
        <label htmlFor="dashboard-month" className="sr-only">
          Mes
        </label>

        <Select
          id="dashboard-month"
          size="sm"
          value={String(period.month)}
          options={monthOptions}
          onChange={(value) => navigate({ ...period, month: Number(value) })}
        />
      </div>

      <div className="w-28">
        <label htmlFor="dashboard-year" className="sr-only">
          Año
        </label>

        <Select
          id="dashboard-year"
          size="sm"
          value={String(period.year)}
          options={yearOptions}
          onChange={(value) => navigate({ ...period, year: Number(value) })}
        />
      </div>
    </div>
  );
}
