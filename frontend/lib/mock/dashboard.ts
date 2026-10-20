import type {
  DashboardSummary,
  ExpensesByCategory,
  MonthlyTrend,
} from "@/types";

export const mockSummary: DashboardSummary = {
  totalIncome: 1250000 + 480000,
  totalExpenses: 320000 + 68500 + 45000 + 38000,
  netBalance: 1250000 + 480000 - (320000 + 68500 + 45000 + 38000),
};

export const mockExpensesByCategory: ExpensesByCategory[] = [
  { categoryId: 3, categoryName: "Vivienda", total: 320000 },
  { categoryId: 4, categoryName: "Alimentación", total: 68500 },
  { categoryId: 5, categoryName: "Transporte", total: 45000 },
  { categoryId: 6, categoryName: "Servicios", total: 38000 },
];

export const mockMonthlyTrends: MonthlyTrend[] = [
  { month: "2026-05", income: 850000, expenses: 420000 },
  { month: "2026-06", income: 920000, expenses: 510000 },
  { month: "2026-07", income: 780000, expenses: 460000 },
  { month: "2026-08", income: 1100000, expenses: 620000 },
  { month: "2026-09", income: 1250000, expenses: 540000 },
  { month: "2026-10", income: 1730000, expenses: 471500 },
];
