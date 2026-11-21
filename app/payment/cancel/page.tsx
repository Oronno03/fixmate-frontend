import Link from "next/link";
import { CreditCard, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-7 text-center shadow-[0_30px_80px_-60px_rgba(0,0,0,0.9)] sm:p-9">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-amber-400/12 text-amber-300">
        <XCircle className="size-7" />
      </span>
      <h1 className="mt-5 font-heading text-2xl font-bold tracking-tight">
        Payment cancelled
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        No charge was made. Your booking is still waiting for payment, and you
        can complete it any time from My Bookings.
      </p>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Button
          className="h-10 rounded-full px-5 font-semibold"
          render={<Link href="/dashboard/customer/bookings" />}
        >
          <CreditCard className="size-4" />
          Back to my bookings
        </Button>
        <Button
          variant="outline"
          className="h-10 rounded-full px-5"
          render={<Link href="/services" />}
        >
          Browse services
        </Button>
      </div>
    </div>
  );
}
