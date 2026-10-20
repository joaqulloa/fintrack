"use client";

import { useEffect, useState } from "react";

import type { Category, TransactionFilters } from "@/types";
import { getCategories } from "@/lib/api/categories";

interface TransactionFiltersBarProps {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
}

export default function TransactionFiltersBar({
  filters,
  onChange,
}: TransactionFiltersBarProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const update = (patch: Partial<TransactionFilters>) => {
    onChange({ ...filters, ...patch });
  };

  return (
    <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100/50 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Desde
        </label>
        <input
          type="date"
          value={filters.startDate ?? ""}
          onChange={(e) => update({ startDate: e.target.value || undefined })}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Hasta
        </label>
        <input
          type="date"
          value={filters.endDate ?? ""}
          onChange={(e) => update({ endDate: e.target.value || undefined })}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Tipo
        </label>
        <select
          value={filters.type ?? ""}
          onChange={(e) =>
            update({
              type: (e.target.value || undefined) as TransactionFilters["type"],
            })
          }
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">Todos</option>
          <option value="income">Ingresos</option>
          <option value="expense">Gastos</option>
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Categoría
        </label>
        <select
          value={filters.categoryId ?? ""}
          onChange={(e) =>
            update({
              categoryId: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">Todas</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
