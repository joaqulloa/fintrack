import type { Metadata } from "next";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

import { getCategories } from "@/lib/api/categories";

export const metadata: Metadata = {
  title: "Categorías",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  const income = categories.filter((c) => c.type === "income");
  const expense = categories.filter((c) => c.type === "expense");

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Categorías
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Clasificaciones disponibles para tus transacciones.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryGroup
          title="Ingresos"
          type="income"
          categories={income}
        />
        <CategoryGroup
          title="Gastos"
          type="expense"
          categories={expense}
        />
      </div>
    </div>
  );
}

interface CategoryGroupProps {
  title: string;
  type: "income" | "expense";
  categories: Awaited<ReturnType<typeof getCategories>>;
}

function CategoryGroup({ title, type, categories }: CategoryGroupProps) {
  const isIncome = type === "income";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100/50 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            isIncome
              ? "bg-emerald-50 text-emerald-600"
              : "bg-rose-50 text-rose-600"
          }`}
        >
          {isIncome ? (
            <ArrowDownLeft size={20} strokeWidth={1.8} />
          ) : (
            <ArrowUpRight size={20} strokeWidth={1.8} />
          )}
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500">
            {categories.length} categoría{categories.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <ul className="space-y-2">
        {categories.map((category) => (
          <li
            key={category.id}
            className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3"
          >
            <span className="text-sm font-medium text-slate-700">
              {category.name}
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                isIncome
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
              }`}
            >
              {isIncome ? "Ingreso" : "Gasto"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
