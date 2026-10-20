"use client";

import { useEffect, useState } from "react";

import type { Category, Transaction, TransactionType } from "@/types";
import type { TransactionInput } from "@/lib/api/transactions";
import { getCategories } from "@/lib/api/categories";

interface TransactionFormProps {
  initial?: Transaction | null;
  onSubmit: (input: TransactionInput) => Promise<void> | void;
  onCancel: () => void;
  submitting?: boolean;
}

interface FormErrors {
  description?: string;
  amount?: string;
  categoryId?: string;
}

export default function TransactionForm({
  initial,
  onSubmit,
  onCancel,
  submitting = false,
}: TransactionFormProps) {
  const [description, setDescription] = useState(initial?.description ?? "");
  const [amount, setAmount] = useState(
    initial?.amount ? String(initial.amount) : "",
  );
  const [type, setType] = useState<TransactionType>(initial?.type ?? "expense");
  const [date, setDate] = useState(
    initial?.date ?? new Date().toISOString().slice(0, 10),
  );
  const [categoryId, setCategoryId] = useState<number | "">(
    initial?.categoryId ?? "",
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const availableCategories = categories.filter((c) => c.type === type);

  const handleTypeChange = (nextType: TransactionType) => {
    setType(nextType);
    setCategoryId("");
  };

  const validate = (): boolean => {
    const next: FormErrors = {};

    if (!description.trim()) {
      next.description = "La descripción es obligatoria.";
    }

    const parsedAmount = Number(amount);
    if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      next.amount = "El monto debe ser mayor que cero.";
    }

    if (!categoryId) {
      next.categoryId = "Debes seleccionar una categoría.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validate()) return;

    await onSubmit({
      description: description.trim(),
      amount: Number(amount),
      type,
      date,
      categoryId: Number(categoryId),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100/50 sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Descripción
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: Supermercado"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          {errors.description && (
            <p className="mt-1.5 text-xs text-rose-600">
              {errors.description}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Tipo
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(["expense", "income"] as TransactionType[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleTypeChange(option)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                  type === option
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {option === "income" ? "Ingreso" : "Gasto"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Monto (CLP)
          </label>
          <input
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          {errors.amount && (
            <p className="mt-1.5 text-xs text-rose-600">{errors.amount}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Fecha
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Categoría
          </label>
          <select
            value={categoryId}
            onChange={(e) =>
              setCategoryId(e.target.value ? Number(e.target.value) : "")
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Selecciona una categoría</option>
            {availableCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1.5 text-xs text-rose-600">{errors.categoryId}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "Guardando..."
            : initial
              ? "Guardar cambios"
              : "Crear transacción"}
        </button>
      </div>
    </form>
  );
}
