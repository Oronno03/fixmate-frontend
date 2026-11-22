"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Plus,
  Wrench,
} from "lucide-react";

import {
  CardsSkeleton,
  DashboardError,
  TableSkeleton,
} from "@/components/dashboard/DataState";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { BookingStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Booking, Payment } from "@/lib/types";

const ACTIVE = new Set(["requested", "accepted", "in-progress"]);

export default function CustomerOverviewPage() {
  const bookingsQuery = useApi<Booking[]>("/api/bookings/my");
  const paymentsQuery = useApi<Payment[]>("/api/payments/my");

  const bookings = useMemo(() => bookingsQuery.data ?? [], [bookingsQuery.data]);
  const payments = useMemo(() => paymentsQuery.data ?? [], [paymentsQuery.data]);

  const stats = useMemo(
    () => ({
      total: bookings.length,
      active: bookings.filter((booking) => ACTIVE.has(booking.status)).length,
      completed: bookings.filter((booking) => booking.status === "completed")
        .length,
      paid: payments.reduce(
        (sum, payment) => sum + Number(payment.amount || 0),
        0,
      ),
    }),
    [bookings, payments],
  );

  const recent = bookings.slice(0, 5);
  const loading = bookingsQuery.isLoading || paymentsQuery.isLoading;
  const error = bookingsQuery.error || paymentsQuery.error;

  if (error) {
    return (
      <DashboardError
        message={error.message}
        onRetry={() => {
          bookingsQuery.mutate();
          paymentsQuery.mutate();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Customer workspace"
        title="Your repair overview"
        description="Track active jobs, review completed repairs, and pay only when the work is done."
        actions={
          <>
            <Button
              variant="outline"
              className="h-9 rounded-full px-4"
              render={<Link href="/dashboard/customer/bookings" />}
            >
              My bookings
            </Button>
            <Button
              className="h-9 rounded-full px-4 font-semibold"
              render={<Link href="/services" />}
            >
              <Plus className="size-4" />
              New request
            </Button>
          </>
        }
      />

      {loading ? (
        <CardsSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            label="Total requests"
            value={stats.total}
            hint="All repair requests you have sent"
            icon={ClipboardList}
            accent="blue"
          />
          <StatsCard
            label="Active jobs"
            value={stats.active}
            hint="Requested, accepted, or in progress"
            icon={Wrench}
            accent="amber"
          />
          <StatsCard
            label="Completed jobs"
            value={stats.completed}
            hint="Ready to review and pay"
            icon={CheckCircle2}
            accent="green"
          />
          <StatsCard
            label="Total paid"
            value={formatCurrency(stats.paid)}
            hint={`${payments.length} successful payments`}
            icon={CreditCard}
            accent="gold"
          />
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr] lg:items-start">
        <div className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <h2 className="font-heading text-base font-semibold">
                Recent requests
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Your latest repair activity
              </p>
            </div>
            <Link
              href="/dashboard/customer/bookings"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              View all
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="p-5">
            {loading ? (
              <TableSkeleton rows={3} />
            ) : recent.length === 0 ? (
              <EmptyState
                icon={ClipboardList}
                title="No repair requests yet"
                description="Find a verified technician and send your first request. You will be able to track every step from here."
                action={
                  <Button
                    className="h-10 rounded-full px-5"
                    render={<Link href="/services" />}
                  >
                    Browse services
                  </Button>
                }
              />
            ) : (
              <ul className="divide-y divide-border">
                {recent.map((booking) => (
                  <li
                    key={booking._id}
                    className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {booking.serviceTitle}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {booking.technicianName} · {formatDate(booking.createdAt)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-sm font-semibold">
                        {formatCurrency(
                          booking.finalAmount || booking.basePrice,
                        )}
                      </span>
                      <BookingStatusBadge status={booking.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card p-5">
            <p className="eyebrow">Payment</p>
            <h2 className="mt-2 font-heading text-lg font-semibold">
              Pay after completion
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              When a technician marks your job complete, the final amount
              appears in My Bookings. Review it, then pay securely with Stripe.
            </p>
            <Button
              variant="outline"
              className="mt-4 h-9 rounded-full px-4"
              render={<Link href="/dashboard/customer/payments" />}
            >
              <CreditCard className="size-4" />
              Payment history
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-heading text-base font-semibold">
              Need something fixed?
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Browse admin-approved services across seven repair categories.
            </p>
            <Button
              className="mt-4 h-9 w-full rounded-full font-semibold"
              render={<Link href="/services" />}
            >
              Browse services
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
