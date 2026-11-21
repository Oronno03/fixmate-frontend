import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { CurrentYear } from "@/components/layout/CurrentYear";
import { Logo } from "@/components/layout/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-20rem] left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]" />
        <div className="absolute right-[-12rem] bottom-[-16rem] h-[30rem] w-[30rem] rounded-full bg-[#6F5D28]/20 blur-[120px]" />
      </div>

      <header className="container-page flex h-20 items-center justify-between">
        <Logo />
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-3.5" />
          Back to home
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:py-12">
        {children}
      </main>

      <footer className="container-page py-6 text-center text-xs text-muted-foreground">
        © <CurrentYear /> FixMate · Verified repairs, fair payments.
      </footer>
    </div>
  );
}
