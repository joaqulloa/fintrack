"use client";

import { useEffect, useMemo, useState } from "react";

import type { Category, TransactionFilters } from "@/types";
import { getCategories } from "@/lib/api/categories";
import Select from "@/components/ui/select";

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

  const typeOptions = useMemo(
    () => [
      { value: "", label: "Todos" },
      { value: "income", label: "Ingresos" },
      { value: "expense", label: "Gastos" },
    ],
    [],
  );

  const categoryOptions = useMemo(
    () => [
      { value: "", label: "Todas" },
      ...categories.map((category) => ({
        value: String(category.id),
        label: category.name,
      })),
    ],
    [categories],
  );

  return (
    <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100/50 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label
          htmlFor="filter-start-date"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400"
        >
          Desde
        </label>
        <input
          id="filter-start-date"
          type="date"
          value={filters.startDate ?? ""}
          onChange={(e) => update({ startDate: e.target.value || undefined })}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label
          htmlFor="filter-end-date"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400"
        >
          Hasta
        </label>
        <input
          id="filter-end-date"
          type="date"
          value={filters.endDate ?? ""}
          onChange={(e) => update({ endDate: e.target.value || undefined })}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label
          htmlFor="filter-type"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400"
        >
          Tipo
        </label>
        <Select
          id="filter-type"
          size="sm"
          value={filters.type ?? ""}
          options={typeOptions}
          onChange={(value) =>
            update({
              type: (value || undefined) as TransactionFilters["type"],
            })
          }
        />
      </div>

      <div>
        <label
          htmlFor="filter-category"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400"
        >
          Categoría
        </label>
        <Select
          id="filter-category"
          size="sm"
          value={filters.categoryId ? String(filters.categoryId) : ""}
          options={categoryOptions}
          onChange={(value) =>
            update({
              categoryId: value ? Number(value) : undefined,
            })
          }
        />
      </div>
    </div>
  );
}
