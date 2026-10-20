import type { Metadata } from "next";
import { Construction } from "lucide-react";

export const metadata: Metadata = {
  title: "Configuración",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Configuración
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Ajustes de tu cuenta y preferencias.
        </p>
      </section>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <Construction size={26} strokeWidth={1.8} />
        </div>

        <h3 className="mt-4 text-base font-bold text-slate-900">
          Próximamente
        </h3>

        <p className="mt-1 max-w-sm text-sm text-slate-500">
          La personalización de la cuenta, moneda y presupuestos llegará en
          futuras versiones.
        </p>
      </div>
    </div>
  );
}
