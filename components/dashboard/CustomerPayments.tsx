"use client";

import Link from "next/link";
import { useMemo } from "react";
import { CreditCard, Receipt } from "lucide-react";

import { DashboardError, TableSkeleton } from "@/components/dashboard/DataState";
import { EmptyState } from "@/components/shared/EmptyState";
import { PaymentStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApi } from "@/hooks/use-api";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { Payment } from "@/lib/types";

export function CustomerPayments() {
  const { data, error, isLoading, mutate } = useApi<Payment[]>(
    "/api/payments/my",
  );

  const payments = useMemo(() => data ?? [], [data]);
  const total = useMemo(
    () => payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
    [payments],
  );

  if (error) {
    return <DashboardError message={error.message} onRetry={() => mutate()} />;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
            <CreditCard className="size-5" />
          </span>
          <div>
            <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Total paid
            </p>
            <p className="font-heading text-2xl font-bold tracking-tight text-primary">
              {formatCurrency(total)}
            </p>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {payments.length} successful {payments.length === 1 ? "payment" : "payments"} ·
          secured by Stripe
        </p>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} />
      ) : payments.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No payments yet"
          description="Once a technician completes your repair, you can pay the final amount here. Payment history and receipts will appear on this page."
          action={
            <Button
              className="h-10 rounded-full px-5"
              render={<Link href="/dashboard/customer/bookings" />}
            >
              View my bookings
            </Button>
          }
        />
      ) : (
        <div className="rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Service</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>Paid at</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="pr-4">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell className="max-w-64 pl-4 whitespace-normal">
                    <p className="truncate font-medium">{payment.serviceTitle}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Booking {payment.bookingId.slice(-8)}
                    </p>
                  </TableCell>
                  <TableCell>{payment.technicianName}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {payment.transactionId
                      ? `${payment.transactionId.slice(0, 18)}…`
                      : "—"}
                  </TableCell>
                  <TableCell>{formatDateTime(payment.paidAt)}</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(payment.amount)}
                  </TableCell>
                  <TableCell className="pr-4">
                    <PaymentStatusBadge status="paid" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
