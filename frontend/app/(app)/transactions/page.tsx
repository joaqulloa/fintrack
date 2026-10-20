import type { Metadata } from "next";
import { Suspense } from "react";

import TransactionsView from "@/components/transactions/transactions-view";
import { TableSkeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Transacciones",
};

export default function TransactionsPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <TableSkeleton />
        </div>
      }
    >
      <TransactionsView />
    </Suspense>
  );
}
