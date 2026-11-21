import Link from "next/link";
import { Compass, Home, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-18rem] left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]" />
      </div>

      <span className="grid size-14 place-items-center rounded-2xl bg-primary/12 text-primary">
        <Compass className="size-7" />
      </span>
      <p className="eyebrow mt-6">404</p>
      <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
        This page could not be found
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        The link may be broken, or the service might have been removed or is no
        longer available.
      </p>

      <div className="mt-7 flex flex-col gap-2 sm:flex-row">
        <Button
          className="h-10 rounded-full px-5 font-semibold"
          render={<Link href="/" />}
        >
          <Home className="size-4" />
          Back to home
        </Button>
        <Button
          variant="outline"
          className="h-10 rounded-full px-5"
          render={<Link href="/services" />}
        >
          <Wrench className="size-4" />
          Browse services
        </Button>
      </div>
    </div>
  );
}
