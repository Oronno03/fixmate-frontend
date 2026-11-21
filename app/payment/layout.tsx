import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { requireUser } from "@/lib/session";

export const instant = false;

export default async function PaymentLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireUser();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-20rem] left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]" />
      </div>

      <header className="container-page flex h-20 items-center justify-between">
        <Logo />
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-3.5" />
          Back to dashboard
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        {children}
      </main>
    </div>
  );
}
