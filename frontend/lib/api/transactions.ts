import type { Transaction, TransactionFilters } from "@/types";
import { mockTransactions } from "@/lib/mock/transactions";
import { mockCategories } from "@/lib/mock/categories";

let transactions: Transaction[] = mockTransactions.map((t) => ({ ...t }));

const hydrate = (transaction: Transaction): Transaction => ({
  ...transaction,
  category: mockCategories.find((c) => c.id === transaction.categoryId),
});

export async function getTransactions(
  filters: TransactionFilters = {},
): Promise<Transaction[]> {
  let result = [...transactions];

  if (filters.type) {
    result = result.filter((t) => t.type === filters.type);
  }
  if (filters.categoryId) {
    result = result.filter((t) => t.categoryId === filters.categoryId);
  }
  if (filters.startDate) {
    result = result.filter((t) => t.date >= filters.startDate!);
  }
  if (filters.endDate) {
    result = result.filter((t) => t.date <= filters.endDate!);
  }

  return result
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(hydrate);
}

export async function getTransaction(id: number): Promise<Transaction | null> {
  const found = transactions.find((t) => t.id === id);
  return found ? hydrate(found) : null;
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
  const now = new Date().toISOString();
  const nextId = Math.max(0, ...transactions.map((t) => t.id)) + 1;

  const transaction: Transaction = {
    id: nextId,
    ...input,
    createdAt: now,
    updatedAt: now,
  };

  transactions = [transaction, ...transactions];
  return hydrate(transaction);
}

export async function updateTransaction(
  id: number,
  input: TransactionInput,
): Promise<Transaction | null> {
  const index = transactions.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const updated: Transaction = {
    ...transactions[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };

  transactions[index] = updated;
  return hydrate(updated);
}

export async function deleteTransaction(id: number): Promise<boolean> {
  const before = transactions.length;
  transactions = transactions.filter((t) => t.id !== id);
  return transactions.length < before;
}
