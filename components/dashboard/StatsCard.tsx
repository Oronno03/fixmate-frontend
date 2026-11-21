import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function StatsCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "gold",
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon: LucideIcon;
  accent?: "gold" | "blue" | "green" | "amber" | "purple";
  className?: string;
}) {
  const accents = {
    gold: "bg-primary/12 text-primary",
    blue: "bg-blue-400/12 text-blue-300",
    green: "bg-emerald-400/12 text-emerald-300",
    amber: "bg-amber-400/12 text-amber-300",
    purple: "bg-purple-400/12 text-purple-300",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {label}
          </p>
          <p className="mt-2 font-heading text-3xl font-bold tracking-tight">
            {value}
          </p>
          {hint && (
            <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
          )}
        </div>
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-xl",
            accents[accent],
          )}
        >
          <Icon className="size-5" />
        </span>
      </div>
      <span className="pointer-events-none absolute -right-8 -bottom-10 size-24 rounded-full bg-primary/5 blur-2xl" />
    </div>
  );
}
