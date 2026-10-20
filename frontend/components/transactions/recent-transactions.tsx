import {
  ArrowDownLeft,
  ArrowUpRight,
  ShoppingBag,
  House,
  BriefcaseBusiness,
  Car,
  Receipt,
  Tag,
} from "lucide-react";

import type { Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils/format";

const ICONS: Record<string, typeof Tag> = {
  Sueldo: BriefcaseBusiness,
  Freelance: BriefcaseBusiness,
  Vivienda: House,
  Alimentación: ShoppingBag,
  Transporte: Car,
  Servicios: Receipt,
};

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({
  transactions,
}: RecentTransactionsProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-100 text-xs text-slate-400">
            <th className="pb-4 pr-4 font-medium">Transacción</th>
            <th className="hidden pb-4 pr-4 font-medium sm:table-cell">
              Categoría
            </th>
            <th className="hidden pb-4 pr-4 font-medium md:table-cell">Fecha</th>
            <th className="pb-4 text-right font-medium">Monto</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((transaction) => {
            const isIncome = transaction.type === "income";
            const categoryName = transaction.category?.name ?? "Sin categoría";
            const Icon = ICONS[categoryName] ?? Tag;

            return (
              <tr
                key={transaction.id}
                className="border-b border-slate-50 last:border-0"
              >
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isIncome
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Icon size={18} strokeWidth={1.8} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {transaction.description}
                      </p>
                      <p className="mt-1 text-xs text-slate-400 sm:hidden">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="hidden py-4 pr-4 text-sm text-slate-500 sm:table-cell">
                  {categoryName}
                </td>

                <td className="hidden py-4 pr-4 text-sm text-slate-500 md:table-cell">
                  {formatDate(transaction.date)}
                </td>

                <td className="py-4 text-right">
                  <div
                    className={`inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold ${
                      isIncome ? "text-emerald-600" : "text-slate-800"
                    }`}
                  >
                    {isIncome ? (
                      <ArrowDownLeft size={15} />
                    ) : (
                      <ArrowUpRight size={15} />
                    )}

                    {isIncome ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
