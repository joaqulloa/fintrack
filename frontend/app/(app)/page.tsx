import { Suspense } from "react";
import { connection } from "next/server";

import Dashboard from "@/components/dashboard/dashboard";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import { parsePeriod } from "@/lib/utils/period";

interface HomeProps {
  searchParams: Promise<{ month?: string; year?: string }>;
}

export default function Home({ searchParams }: HomeProps) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent searchParams={searchParams} />
    </Suspense>
  );
}

async function DashboardContent({ searchParams }: HomeProps) {
  await connection();

  const params = await searchParams;
  const period = parsePeriod(params);

  return <Dashboard period={period} />;
}
