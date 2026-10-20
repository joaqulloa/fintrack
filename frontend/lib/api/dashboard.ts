import type {
  DashboardSummary,
  ExpensesByCategory,
  MonthlyTrend,
} from "@/types";
import {
  mockExpensesByCategory,
  mockMonthlyTrends,
  mockSummary,
} from "@/lib/mock/dashboard";

export interface DateRange {
  startDate?: string;
  endDate?: string;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return { ...mockSummary };
}

export async function getExpensesByCategory(): Promise<ExpensesByCategory[]> {
  return [...mockExpensesByCategory];
}

export async function getMonthlyTrends(): Promise<MonthlyTrend[]> {
  return [...mockMonthlyTrends];
}
