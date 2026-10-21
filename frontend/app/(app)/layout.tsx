"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Wallet } from "lucide-react";

import Sidebar from "@/components/layout/sidebar";

function pageTitle(pathname: string): string {
  if (pathname.startsWith("/transactions")) return "Transacciones";
  if (pathname.startsWith("/categories")) return "Categorías";
  if (pathname.startsWith("/settings")) return "Configuración";
  return "Resumen financiero";
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block">
        <Sidebar />
      </div>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-40 lg:hidden">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </>
      )}

      <main className="min-w-0 flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu size={22} />
            </button>

            <div className="flex items-center gap-2 lg:hidden">
              <Wallet className="text-blue-600" size={22} />
              <span className="font-bold text-slate-900">FinTrack</span>
            </div>

            <h1 className="hidden text-xl font-bold tracking-tight text-slate-900 lg:block">
              {pageTitle(pathname)}
            </h1>
          </div>
        </header>

        <div className="mx-auto max-w-[1600px] p-5 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
