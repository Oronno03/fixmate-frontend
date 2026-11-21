"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Loader2,
  Receipt,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { Payment } from "@/lib/types";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const started = useRef(false);

  const [payment, setPayment] = useState<Payment | null>(null);
  const [error, setError] = useState(
    sessionId ? "" : "Missing Stripe checkout session. Please contact support.",
  );
  const [loading, setLoading] = useState(Boolean(sessionId));

  useEffect(() => {
    if (started.current || !sessionId) return;
    started.current = true;

    apiFetch<Payment>(
      `/api/payments/verify?session_id=${encodeURIComponent(sessionId)}`,
    )
      .then((data) => setPayment(data))
      .catch((verifyError) =>
        setError(
          verifyError instanceof Error
            ? verifyError.message
            : "We could not verify this payment.",
        ),
      )
      .finally(() => setLoading(false));
  }, [sessionId]);

  return (
    <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-7 text-center shadow-[0_30px_80px_-60px_rgba(0,0,0,0.9)] sm:p-9">
      {loading ? (
        <>
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary/12 text-primary">
            <Loader2 className="size-7 animate-spin" />
          </span>
          <h1 className="mt-5 font-heading text-2xl font-bold tracking-tight">
            Verifying your payment…
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Please keep this page open while we confirm the transaction with
            Stripe.
          </p>
        </>
      ) : error ? (
        <>
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-destructive/12 text-destructive">
            <XCircle className="size-7" />
          </span>
          <h1 className="mt-5 font-heading text-2xl font-bold tracking-tight">
            Payment could not be verified
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {error}
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button
              className="h-10 rounded-full px-5 font-semibold"
              render={<Link href="/dashboard/customer/bookings" />}
            >
              Go to my bookings
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-full px-5"
              render={<Link href="/" />}
            >
              Back to home
            </Button>
          </div>
        </>
      ) : (
        <>
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-400/12 text-emerald-300">
            <CheckCircle2 className="size-7" />
          </span>
          <h1 className="mt-5 font-heading text-2xl font-bold tracking-tight">
            Payment successful
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Thank you. Your payment has been confirmed and the booking is marked
            as paid.
          </p>

          {payment && (
            <div className="mt-6 space-y-3 rounded-2xl border border-border bg-secondary/30 p-4 text-left text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <Receipt className="size-4 text-primary" />
                  Service
                </span>
                <span className="max-w-56 truncate font-medium">
                  {payment.serviceTitle}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="size-4 text-primary" />
                  Amount
                </span>
                <span className="font-semibold text-primary">
                  {formatCurrency(payment.amount)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck className="size-4 text-primary" />
                  Transaction
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {payment.transactionId
                    ? `${payment.transactionId.slice(0, 20)}…`
                    : "Confirmed"}
                </span>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button
              className="h-10 rounded-full px-5 font-semibold"
              render={<Link href="/dashboard/customer/bookings" />}
            >
              View my bookings
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-full px-5"
              render={<Link href="/services" />}
            >
              Browse services
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="h-80 w-full max-w-lg animate-pulse rounded-3xl border border-border bg-card" />
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
