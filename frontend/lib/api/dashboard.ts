import { apiFetch } from "@/lib/api/http";
import type {
  DashboardSummary,
  ExpensesByCategory,
  MonthlyTrend,
} from "@/types";

export interface DateRange {
  startDate?: string;
  endDate?: string;
}

interface ApiSummary {
  total_income: string | number;
  total_expenses: string | number;
  net_balance: string | number;
}

interface ApiExpensesByCategory {
  category_id: number;
  category_name: string;
  total: string | number;
}

interface ApiMonthlyTrend {
  month: string;
  income: string | number;
  expenses: string | number;
}

function buildQuery(range: DateRange = {}): string {
  const params = new URLSearchParams();

  if (range.startDate) params.set("start_date", range.startDate);
  if (range.endDate) params.set("end_date", range.endDate);

  const query = params.toString();
  return query ? `?${query}` : "";
}

export async function getDashboardSummary(
  range: DateRange = {},
): Promise<DashboardSummary> {
  const summary = await apiFetch<ApiSummary>(
    `/api/dashboard/summary${buildQuery(range)}`,
  );

  return {
    totalIncome: Number(summary.total_income),
    totalExpenses: Number(summary.total_expenses),
    netBalance: Number(summary.net_balance),
  };
}

export async function getExpensesByCategory(
  range: DateRange = {},
): Promise<ExpensesByCategory[]> {
  const items = await apiFetch<ApiExpensesByCategory[]>(
    `/api/dashboard/expenses-by-category${buildQuery(range)}`,
  );

  return items.map((item) => ({
    categoryId: item.category_id,
    categoryName: item.category_name,
    total: Number(item.total),
  }));
}

export async function getMonthlyTrends(
  range: DateRange = {},
): Promise<MonthlyTrend[]> {
  const items = await apiFetch<ApiMonthlyTrend[]>(
    `/api/dashboard/monthly-trends${buildQuery(range)}`,
  );

  return items.map((item) => ({
    month: item.month,
    income: Number(item.income),
    expenses: Number(item.expenses),
  }));
}
