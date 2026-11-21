"use client";

import { useMemo } from "react";
import { CreditCard, Receipt, TrendingUp } from "lucide-react";

import { DashboardError, TableSkeleton } from "@/components/dashboard/DataState";
import { EmptyState } from "@/components/shared/EmptyState";
import { PaymentStatusBadge } from "@/components/shared/status-badge";
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

export function AdminTransactions() {
  const { data, error, isLoading, mutate } = useApi<Payment[]>(
    "/api/admin/payments",
  );

  const payments = useMemo(() => data ?? [], [data]);
  const totalRevenue = useMemo(
    () => payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
    [payments],
  );
  const average =
    payments.length > 0 ? totalRevenue / payments.length : 0;

  if (error) {
    return <DashboardError message={error.message} onRetry={() => mutate()} />;
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total revenue",
            value: formatCurrency(totalRevenue),
            icon: TrendingUp,
          },
          {
            label: "Transactions",
            value: payments.length,
            icon: Receipt,
          },
          {
            label: "Average payment",
            value: formatCurrency(average),
            icon: CreditCard,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-start justify-between rounded-2xl border border-border bg-card p-5"
          >
            <div>
              <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                {stat.label}
              </p>
              <p className="mt-1.5 font-heading text-2xl font-bold tracking-tight">
                {stat.value}
              </p>
            </div>
            <span className="grid size-10 place-items-center rounded-xl bg-primary/12 text-primary">
              <stat.icon className="size-5" />
            </span>
          </div>
        ))}
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : payments.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No transactions yet"
          description="Stripe payments will appear here as customers pay for completed repairs."
        />
      ) : (
        <div className="rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Service</TableHead>
                <TableHead>Customer</TableHead>
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
                  <TableCell>
                    <p className="font-medium">{payment.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {payment.customerEmail}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{payment.technicianName}</p>
                    <p className="text-xs text-muted-foreground">
                      {payment.technicianEmail}
                    </p>
                  </TableCell>
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
