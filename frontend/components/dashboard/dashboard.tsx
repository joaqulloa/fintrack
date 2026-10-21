import Link from "next/link";
import { connection } from "next/server";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";

import SummaryCard from "@/components/dashboard/summary-card";
import CashflowChart from "@/components/dashboard/cashflow-chart";
import ExpensesChart from "@/components/dashboard/expenses-chart";
import PeriodSelector from "@/components/dashboard/period-selector";
import RecentTransactions from "@/components/transactions/recent-transactions";
import { getDashboardSummary, getExpensesByCategory, getMonthlyTrends } from "@/lib/api/dashboard";
import { getTransactions } from "@/lib/api/transactions";
import { formatCurrency } from "@/lib/utils/format";
import {
  formatPeriodLabel,
  periodKey,
  periodRange,
  previousPeriod,
  type Period,
} from "@/lib/utils/period";

interface DashboardProps {
  period: Period;
}

function percentChange(current: number, previous: number): number | undefined {
  if (previous === 0) return undefined;

  return ((current - previous) / previous) * 100;
}

export default async function Dashboard({ period }: DashboardProps) {
  await connection();

  const range = periodRange(period);
  const previousRange = periodRange(previousPeriod(period));

  const [summary, previousSummary, expensesByCategory, trends, transactions] =
    await Promise.all([
      getDashboardSummary(range),
      getDashboardSummary(previousRange),
      getExpensesByCategory(range),
      getMonthlyTrends(),
      getTransactions(range),
    ]);

  const recentTransactions = transactions.slice(0, 4);

  const dataYears = trends.map((trend) => Number(trend.month.slice(0, 4)));
  const firstYear = Math.min(period.year, ...dataYears);
  const lastYear = Math.max(period.year, ...dataYears);
  const years = Array.from(
    { length: lastYear - firstYear + 1 },
    (_, index) => lastYear - index,
  );

  const cashflowData = trends
    .filter((trend) => trend.month <= periodKey(period))
    .slice(-12);

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-500">Balance del mes</p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {formatCurrency(summary.netBalance)}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Balance de {formatPeriodLabel(period)}
          </p>
        </div>

        <PeriodSelector period={period} years={years} />
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          title="Ingresos del mes"
          amount={summary.totalIncome}
          icon={ArrowDownLeft}
          color="green"
          change={percentChange(
            summary.totalIncome,
            previousSummary.totalIncome,
          )}
          description="vs. mes anterior"
        />

        <SummaryCard
          title="Gastos del mes"
          amount={summary.totalExpenses}
          icon={ArrowUpRight}
          color="red"
          change={percentChange(
            summary.totalExpenses,
            previousSummary.totalExpenses,
          )}
          description="vs. mes anterior"
        />

        <SummaryCard
          title="Balance del mes"
          amount={summary.netBalance}
          icon={Wallet}
          color="blue"
          change={percentChange(
            summary.netBalance,
            previousSummary.netBalance,
          )}
          description="vs. mes anterior"
        />
      </section>

      <section className="grid items-start gap-6 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100/50 sm:p-6 xl:col-span-2">
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-900">
              Flujo de dinero
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Compara tus ingresos y gastos durante los últimos meses.
            </p>
          </div>

          <CashflowChart data={cashflowData} />
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100/50 sm:p-6">
          <div className="mb-3">
            <h3 className="text-base font-bold text-slate-900">
              Distribución de gastos
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              ¿En qué estás utilizando tu dinero?
            </p>
          </div>

          <ExpensesChart data={expensesByCategory} />
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100/50 sm:p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Transacciones del mes
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Tus últimos movimientos financieros.
            </p>
          </div>

          <Link
            href="/transactions"
            className="whitespace-nowrap text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Ver todas
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">
            No hay transacciones en {formatPeriodLabel(period)}.
          </p>
        ) : (
          <RecentTransactions transactions={recentTransactions} />
        )}
      </section>

      <footer className="pb-2 text-center text-xs text-slate-400">
        FinTrack · Tus finanzas, más claras.
      </footer>
    </div>
  );
}
