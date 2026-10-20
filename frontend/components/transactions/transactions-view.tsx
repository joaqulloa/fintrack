"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Pencil,
  Plus,
  Receipt,
  Trash2,
  X,
} from "lucide-react";

import type { Transaction, TransactionFilters } from "@/types";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
  type TransactionInput,
} from "@/lib/api/transactions";
import { formatCurrency, formatDate } from "@/lib/utils/format";

import TransactionForm from "@/components/transactions/transaction-form";
import TransactionFiltersBar from "@/components/transactions/transaction-filters";
import EmptyState from "@/components/ui/empty-state";
import ErrorState from "@/components/ui/error-state";
import { TableSkeleton } from "@/components/ui/skeleton";

export default function TransactionsView() {
  const searchParams = useSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [formOpen, setFormOpen] = useState(searchParams.get("new") === "1");
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Transaction | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const data = await getTransactions(filters);
      setTransactions(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    let active = true;

    getTransactions(filters)
      .then((data) => {
        if (!active) return;
        setTransactions(data);
        setError(false);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [filters]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (transaction: Transaction) => {
    setEditing(transaction);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (input: TransactionInput) => {
    setSubmitting(true);

    try {
      if (editing) {
        await updateTransaction(editing.id, input);
      } else {
        await createTransaction(input);
      }

      closeForm();
      await load();
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    await deleteTransaction(pendingDelete.id);
    setPendingDelete(null);
    await load();
  };

  const hasFilters =
    filters.startDate ||
    filters.endDate ||
    filters.type ||
    filters.categoryId;

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Transacciones
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Registra y administra tus ingresos y gastos.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Nueva transacción
        </button>
      </section>

      {formOpen && (
        <TransactionForm
          initial={editing}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          submitting={submitting}
        />
      )}

      <TransactionFiltersBar filters={filters} onChange={setFilters} />

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100/50 sm:p-6">
        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <ErrorState onRetry={load} />
        ) : transactions.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title={hasFilters ? "Sin resultados" : "Aún no hay transacciones"}
            description={
              hasFilters
                ? "No encontramos transacciones para los filtros seleccionados."
                : "Registra tu primera transacción para comenzar a ver tus finanzas."
            }
            action={
              !hasFilters && (
                <button
                  type="button"
                  onClick={openCreate}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Plus size={18} />
                  Nueva transacción
                </button>
              )
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-400">
                  <th className="pb-4 pr-4 font-medium">Descripción</th>
                  <th className="hidden pb-4 pr-4 font-medium sm:table-cell">
                    Categoría
                  </th>
                  <th className="hidden pb-4 pr-4 font-medium md:table-cell">
                    Fecha
                  </th>
                  <th className="pb-4 pr-4 text-right font-medium">Monto</th>
                  <th className="pb-4 text-right font-medium">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => {
                  const isIncome = transaction.type === "income";

                  return (
                    <tr
                      key={transaction.id}
                      className="border-b border-slate-50 last:border-0"
                    >
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                              isIncome
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {isIncome ? (
                              <ArrowDownLeft size={17} strokeWidth={1.8} />
                            ) : (
                              <ArrowUpRight size={17} strokeWidth={1.8} />
                            )}
                          </div>

                          <span className="text-sm font-semibold text-slate-800">
                            {transaction.description}
                          </span>
                        </div>
                      </td>

                      <td className="hidden py-4 pr-4 text-sm text-slate-500 sm:table-cell">
                        {transaction.category?.name ?? "Sin categoría"}
                      </td>

                      <td className="hidden py-4 pr-4 text-sm text-slate-500 md:table-cell">
                        {formatDate(transaction.date)}
                      </td>

                      <td
                        className={`py-4 pr-4 text-right text-sm font-semibold ${
                          isIncome ? "text-emerald-600" : "text-slate-800"
                        }`}
                      >
                        {isIncome ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </td>

                      <td className="py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(transaction)}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            aria-label="Editar"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setPendingDelete(transaction)}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                            aria-label="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Eliminar transacción
              </h3>
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              ¿Seguro que quieres eliminar{" "}
              <span className="font-semibold text-slate-700">
                {pendingDelete.description}
              </span>
              ? Esta acción no se puede deshacer.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
