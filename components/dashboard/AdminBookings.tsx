"use client";

import { useMemo, useState } from "react";
import { BriefcaseBusiness } from "lucide-react";

import { DashboardError, TableSkeleton } from "@/components/dashboard/DataState";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  BookingStatusBadge,
  PaymentStatusBadge,
} from "@/components/shared/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApi } from "@/hooks/use-api";
import {
  BOOKING_STATUSES,
  BOOKING_STATUS_LABELS,
} from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Booking, BookingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const FILTERS: Array<{ value: BookingStatus | "all"; label: string }> = [
  { value: "all", label: "All bookings" },
  ...BOOKING_STATUSES.map((status) => ({
    value: status,
    label: BOOKING_STATUS_LABELS[status],
  })),
];

export function AdminBookings() {
  const { data, error, isLoading, mutate } = useApi<Booking[]>(
    "/api/admin/bookings",
  );
  const [filter, setFilter] = useState<BookingStatus | "all">("all");

  const bookings = useMemo(() => data ?? [], [data]);
  const filtered = useMemo(
    () =>
      filter === "all"
        ? bookings
        : bookings.filter((booking) => booking.status === filter),
    [bookings, filter],
  );

  if (error) {
    return <DashboardError message={error.message} onRetry={() => mutate()} />;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => {
          const count =
            item.value === "all"
              ? bookings.length
              : bookings.filter((booking) => booking.status === item.value)
                  .length;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                filter === item.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {item.label}
              <span className="ml-1.5 opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={BriefcaseBusiness}
          title={bookings.length === 0 ? "No bookings yet" : "Nothing in this view"}
          description={
            bookings.length === 0
              ? "Every repair request across the platform will appear here with its status and payment state."
              : "Try another status filter to see the rest of the bookings."
          }
        />
      ) : (
        <div className="rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Service</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Preferred date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-4">Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell className="max-w-64 pl-4 whitespace-normal">
                    <p className="truncate font-medium">{booking.serviceTitle}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {booking.category} · {formatDate(booking.createdAt)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{booking.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.customerEmail}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{booking.technicianName}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.technicianEmail}
                    </p>
                  </TableCell>
                  <TableCell>{formatDate(booking.preferredDate)}</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(booking.finalAmount || booking.basePrice)}
                  </TableCell>
                  <TableCell>
                    <BookingStatusBadge status={booking.status} />
                  </TableCell>
                  <TableCell className="pr-4">
                    <PaymentStatusBadge status={booking.paymentStatus} />
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
