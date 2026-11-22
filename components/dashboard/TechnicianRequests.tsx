"use client";

import { useMemo, useState } from "react";
import {
  Check,
  CheckCircle2,
  Eye,
  Loader2,
  Play,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { BookingTimeline } from "@/components/booking/BookingTimeline";
import { DashboardError, TableSkeleton } from "@/components/dashboard/DataState";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  BookingStatusBadge,
  PaymentStatusBadge,
} from "@/components/shared/status-badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApi } from "@/hooks/use-api";
import { apiFetch } from "@/lib/api";
import {
  BOOKING_STATUSES,
  BOOKING_STATUS_LABELS,
} from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Booking, BookingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const FILTERS: Array<{ value: BookingStatus | "all"; label: string }> = [
  { value: "all", label: "All requests" },
  ...BOOKING_STATUSES.map((status) => ({
    value: status,
    label: BOOKING_STATUS_LABELS[status],
  })),
];

export function TechnicianRequests() {
  const { data, error, isLoading, mutate } = useApi<Booking[]>(
    "/api/bookings/technician",
  );
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [details, setDetails] = useState<Booking | null>(null);
  const [completeTarget, setCompleteTarget] = useState<Booking | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Booking | null>(null);
  const [finalAmount, setFinalAmount] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const bookings = useMemo(() => data ?? [], [data]);

  const filtered = useMemo(
    () =>
      filter === "all"
        ? bookings
        : bookings.filter((booking) => booking.status === filter),
    [bookings, filter],
  );

  const stats = useMemo(
    () => ({
      pending: bookings.filter((booking) => booking.status === "requested")
        .length,
      active: bookings.filter(
        (booking) =>
          booking.status === "accepted" || booking.status === "in-progress",
      ).length,
      completed: bookings.filter((booking) => booking.status === "completed")
        .length,
    }),
    [bookings],
  );

  async function updateStatus(
    booking: Booking,
    status: BookingStatus,
    amount?: number,
  ) {
    setBusyId(booking._id);
    try {
      await apiFetch<Booking>(`/api/bookings/${booking._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status,
          ...(status === "completed" ? { finalAmount: amount } : {}),
        }),
      });
      toast.success(
        status === "completed"
          ? "Job marked completed"
          : `Booking marked ${BOOKING_STATUS_LABELS[status].toLowerCase()}`,
      );
      setCompleteTarget(null);
      setRejectTarget(null);
      await mutate();
    } catch (updateError) {
      toast.error(
        updateError instanceof Error
          ? updateError.message
          : "Could not update this booking.",
      );
    } finally {
      setBusyId(null);
    }
  }

  function openComplete(booking: Booking) {
    setCompleteTarget(booking);
    setFinalAmount(String(booking.finalAmount || booking.basePrice));
  }

  function submitComplete(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!completeTarget) return;
    const amount = Number(finalAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Enter a positive final amount.");
      return;
    }
    updateStatus(completeTarget, "completed", amount);
  }

  if (error) {
    return <DashboardError message={error.message} onRetry={() => mutate()} />;
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "New requests", value: stats.pending },
          { label: "Active jobs", value: stats.active },
          { label: "Completed", value: stats.completed },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-4"
          >
            <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              {stat.label}
            </p>
            <p className="mt-1.5 font-heading text-2xl font-bold">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

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
        <TableSkeleton rows={4} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title={bookings.length === 0 ? "No repair requests yet" : "Nothing in this view"}
          description={
            bookings.length === 0
              ? "When a customer books one of your approved services, the request will appear here for you to accept or reject."
              : "Try another status filter to see the rest of your requests."
          }
        />
      ) : (
        <div className="rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Preferred date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="pr-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell className="pl-4">
                    <p className="font-medium">{booking.customerName}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {booking.customerPhone}
                    </p>
                  </TableCell>
                  <TableCell className="max-w-64 whitespace-normal">
                    <p className="truncate font-medium">{booking.serviceTitle}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {booking.category}
                    </p>
                  </TableCell>
                  <TableCell>{formatDate(booking.preferredDate)}</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(booking.finalAmount || booking.basePrice)}
                  </TableCell>
                  <TableCell>
                    <BookingStatusBadge status={booking.status} />
                  </TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={booking.paymentStatus} />
                  </TableCell>
                  <TableCell className="pr-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="View request details"
                        onClick={() => setDetails(booking)}
                      >
                        <Eye className="size-4" />
                      </Button>

                      {booking.status === "requested" && (
                        <>
                          <Button
                            size="sm"
                            className="h-7 rounded-full px-3 text-xs font-semibold"
                            disabled={busyId === booking._id}
                            onClick={() => updateStatus(booking, "accepted")}
                          >
                            {busyId === booking._id ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Check className="size-3.5" />
                            )}
                            Accept
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Reject request"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            disabled={busyId === booking._id}
                            onClick={() => setRejectTarget(booking)}
                          >
                            <X className="size-4" />
                          </Button>
                        </>
                      )}

                      {booking.status === "accepted" && (
                        <Button
                          size="sm"
                          className="h-7 rounded-full px-3 text-xs font-semibold"
                          disabled={busyId === booking._id}
                          onClick={() => updateStatus(booking, "in-progress")}
                        >
                          {busyId === booking._id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <Play className="size-3.5" />
                          )}
                          Start work
                        </Button>
                      )}

                      {booking.status === "in-progress" && (
                        <Button
                          size="sm"
                          className="h-7 rounded-full px-3 text-xs font-semibold"
                          disabled={busyId === booking._id}
                          onClick={() => openComplete(booking)}
                        >
                          <CheckCircle2 className="size-3.5" />
                          Mark completed
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog
        open={Boolean(details)}
        onOpenChange={(open) => !open && setDetails(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {details && (
            <>
              <DialogHeader>
                <DialogTitle>{details.serviceTitle}</DialogTitle>
                <DialogDescription>
                  Requested {formatDate(details.createdAt)} · {details.customerName}
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-wrap gap-2">
                <BookingStatusBadge status={details.status} />
                <PaymentStatusBadge status={details.paymentStatus} />
              </div>

              <div className="rounded-xl border border-border bg-secondary/20 p-4">
                <p className="mb-3 text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  Job timeline
                </p>
                <BookingTimeline booking={details} />
              </div>

              <div className="grid gap-3 rounded-xl border border-border bg-secondary/30 p-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    Customer
                  </p>
                  <p className="mt-1 font-medium">{details.customerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {details.customerEmail}
                  </p>
                </div>
                <div>
                  <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    Phone
                  </p>
                  <p className="mt-1 font-medium">{details.customerPhone}</p>
                </div>
                <div>
                  <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    Preferred date
                  </p>
                  <p className="mt-1">{formatDate(details.preferredDate)}</p>
                </div>
                <div>
                  <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    Amount
                  </p>
                  <p className="mt-1">
                    {formatCurrency(details.finalAmount || details.basePrice)}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    Service address
                  </p>
                  <p className="mt-1">{details.address}</p>
                </div>
              </div>

              <div>
                <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  Problem description
                </p>
                <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                  {details.problemDescription}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(completeTarget)}
        onOpenChange={(open) => !open && setCompleteTarget(null)}
      >
        <DialogContent className="sm:max-w-md">
          <form onSubmit={submitComplete}>
            <DialogHeader>
              <DialogTitle>Complete this job</DialogTitle>
              <DialogDescription>
                Confirm the final amount for “{completeTarget?.serviceTitle}”.
                The customer will be able to pay this amount after completion.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 space-y-1.5">
              <label htmlFor="finalAmount" className="text-xs font-medium">
                Final amount (USD)
              </label>
              <input
                id="finalAmount"
                type="number"
                min="0.01"
                step="0.01"
                value={finalAmount}
                onChange={(event) => setFinalAmount(event.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-input px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-ring/40"
                required
              />
              <p className="text-[0.7rem] text-muted-foreground">
                Base estimate was{" "}
                {formatCurrency(completeTarget?.basePrice ?? 0)}.
              </p>
            </div>

            <DialogFooter className="mt-5">
              <Button
                type="button"
                variant="outline"
                className="h-10"
                onClick={() => setCompleteTarget(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 font-semibold"
                disabled={busyId === completeTarget?._id}
              >
                {busyId === completeTarget?._id ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="size-4" />
                )}
                Mark completed
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(rejectTarget)}
        onOpenChange={(open) => !open && setRejectTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject this request?</AlertDialogTitle>
            <AlertDialogDescription>
              “{rejectTarget?.serviceTitle}” from {rejectTarget?.customerName}{" "}
              will be rejected. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busyId === rejectTarget?._id}>
              Keep request
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={busyId === rejectTarget?._id}
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() =>
                rejectTarget && updateStatus(rejectTarget, "rejected")
              }
            >
              {busyId === rejectTarget?._id ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              Reject request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
