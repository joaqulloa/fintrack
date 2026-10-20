import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Icon size={26} strokeWidth={1.8} />
      </div>

      <h3 className="mt-4 text-base font-bold text-slate-900">{title}</h3>

      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
