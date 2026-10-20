"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { ExpensesByCategory } from "@/types";
import { formatCurrency } from "@/lib/utils/format";

const COLORS = ["#2563eb", "#8b5cf6", "#f97316", "#06b6d4", "#94a3b8"];

interface ExpensesChartProps {
  data: ExpensesByCategory[];
}

export default function ExpensesChart({ data }: ExpensesChartProps) {
  const total = data.reduce((sum, item) => sum + item.total, 0);

  const chartData = data.map((item, index) => ({
    name: item.categoryName,
    value: item.total,
    color: COLORS[index % COLORS.length],
  }));

  if (data.length === 0) {
    return (
      <div className="flex h-[210px] items-center justify-center text-sm text-slate-400">
        Sin gastos registrados en el período.
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-[210px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={62}
              outerRadius={88}
              paddingAngle={3}
              stroke="none"
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-slate-500">Total gastos</span>
          <span className="mt-1 text-lg font-bold text-slate-900">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-3">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />

            <span className="flex-1 text-sm text-slate-600">{item.name}</span>

            <span className="text-sm font-semibold text-slate-900">
              {formatCurrency(item.value)}
            </span>

            <span className="w-10 text-right text-xs text-slate-400">
              {Math.round((item.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
