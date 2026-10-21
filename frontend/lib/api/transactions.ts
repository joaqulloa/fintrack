import { ApiError, apiFetch } from "@/lib/api/http";
import type { Transaction, TransactionFilters } from "@/types";
import { getCategories } from "@/lib/api/categories";

export interface ApiTransaction {
  id: number;
  description: string;
  amount: string | number;
  type: string;
  date: string;
  category_id: number;
  created_at: string;
  updated_at: string;
}

function mapTransaction(
  transaction: ApiTransaction,
  categoryById: Map<number, Transaction["category"]>,
): Transaction {
  return {
    id: transaction.id,
    description: transaction.description,
    amount: Number(transaction.amount),
    type: transaction.type as Transaction["type"],
    date: transaction.date,
    categoryId: transaction.category_id,
    category: categoryById.get(transaction.category_id),
    createdAt: transaction.created_at,
    updatedAt: transaction.updated_at,
  };
}

function buildQuery(filters: TransactionFilters = {}): string {
  const params = new URLSearchParams();

  if (filters.startDate) params.set("start_date", filters.startDate);
  if (filters.endDate) params.set("end_date", filters.endDate);
  if (filters.type) params.set("type", filters.type);
  if (filters.categoryId) params.set("category_id", String(filters.categoryId));

  const query = params.toString();
  return query ? `?${query}` : "";
}

export async function getTransactions(
  filters: TransactionFilters = {},
): Promise<Transaction[]> {
  const [transactions, categories] = await Promise.all([
    apiFetch<ApiTransaction[]>(`/api/transactions${buildQuery(filters)}`),
    getCategories(),
  ]);

  const categoryById = new Map(categories.map((category) => [category.id, category]));
  return transactions.map((transaction) => mapTransaction(transaction, categoryById));
}

export async function getTransaction(id: number): Promise<Transaction | null> {
  try {
    const [transaction, categories] = await Promise.all([
      apiFetch<ApiTransaction>(`/api/transactions/${id}`),
      getCategories(),
    ]);
    const categoryById = new Map(categories.map((category) => [category.id, category]));
    return mapTransaction(transaction, categoryById);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export type TransactionInput = {
  description: string;
  amount: number;
  type: Transaction["type"];
  date: string;
  categoryId: number;
};

export async function createTransaction(
  input: TransactionInput,
): Promise<Transaction> {
  const transaction = await apiFetch<ApiTransaction>("/api/transactions", {
    method: "POST",
    body: JSON.stringify({
      description: input.description,
      amount: input.amount,
      type: input.type,
      date: input.date,
      category_id: input.categoryId,
    }),
  });

  const categories = await getCategories();
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  return mapTransaction(transaction, categoryById);
}

export async function updateTransaction(
  id: number,
  input: TransactionInput,
): Promise<Transaction | null> {
  try {
    const transaction = await apiFetch<ApiTransaction>(
      `/api/transactions/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          description: input.description,
          amount: input.amount,
          type: input.type,
          date: input.date,
          category_id: input.categoryId,
        }),
      },
    );

    const categories = await getCategories();
    const categoryById = new Map(categories.map((category) => [category.id, category]));
    return mapTransaction(transaction, categoryById);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function deleteTransaction(id: number): Promise<boolean> {
  try {
    await apiFetch<void>(`/api/transactions/${id}`, {
      method: "DELETE",
    });
    return true;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return false;
    }
    throw error;
  }
}
