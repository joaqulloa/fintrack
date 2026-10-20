"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { MonthlyTrend } from "@/types";
import { formatCompactCurrency, formatCurrency, formatMonth } from "@/lib/utils/format";

interface CashflowChartProps {
  data: MonthlyTrend[];
}

export default function CashflowChart({ data }: CashflowChartProps) {
  const chartData = data.map((item) => ({
    month: formatMonth(item.month),
    income: item.income,
    expenses: item.expenses,
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 12, right: 12, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            stroke="#e9eef5"
            strokeDasharray="4 4"
            vertical={false}
          />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            dy={10}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickFormatter={formatCompactCurrency}
            width={58}
          />

          <Tooltip
            formatter={(value, name) => [
              formatCurrency(Number(value)),
              name === "income" ? "Ingresos" : "Gastos",
            ]}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 20px rgba(15, 23, 42, 0.08)",
            }}
          />

          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "12px", paddingBottom: "20px" }}
            formatter={(value) => (value === "income" ? "Ingresos" : "Gastos")}
          />

          <Line
            type="monotone"
            dataKey="income"
            name="income"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 3, fill: "#2563eb", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />

          <Line
            type="monotone"
            dataKey="expenses"
            name="expenses"
            stroke="#f97316"
            strokeWidth={3}
            dot={{ r: 3, fill: "#f97316", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
