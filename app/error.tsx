"use client";

import Link from "next/link";
import { AlertTriangle, Home, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-destructive/12 text-destructive">
        <AlertTriangle className="size-7" />
      </span>
      <h1 className="mt-5 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-[0.7rem] text-muted-foreground/70">
          Reference: {error.digest}
        </p>
      )}

      <div className="mt-7 flex flex-col gap-2 sm:flex-row">
        <Button
          className="h-10 rounded-full px-5 font-semibold"
          onClick={reset}
        >
          <RotateCw className="size-4" />
          Try again
        </Button>
        <Button
          variant="outline"
          className="h-10 rounded-full px-5"
          render={<Link href="/" />}
        >
          <Home className="size-4" />
          Back to home
        </Button>
      </div>
    </div>
  );
}
