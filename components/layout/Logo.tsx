import Link from "next/link";
import { Wrench } from "lucide-react";

import { cn } from "@/lib/utils";

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-2.5", className)}
      aria-label="FixMate home"
    >
      <span className="relative grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_10px_30px_-12px_rgba(201,162,39,0.9)] transition-transform duration-300 group-hover:-rotate-6">
        <Wrench className="size-4" strokeWidth={2.4} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-heading text-lg font-extrabold tracking-tight">
          FixMate
        </span>
        {!compact && (
          <span className="mt-1 text-[0.55rem] font-semibold tracking-[0.28em] text-muted-foreground uppercase">
            Repair marketplace
          </span>
        )}
      </span>
    </Link>
  );
}
