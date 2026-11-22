"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  CreditCard,
  Download,
  Eye,
  Loader2,
  MapPin,
  Phone,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { BookingReview } from "@/components/booking/BookingReview";
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
import { formatCurrency, formatDate } from "@/lib/format";
import { downloadInvoice } from "@/lib/invoice";
import type { Booking } from "@/lib/types";
import { cn } from "@/lib/utils";

const FILTERS = [
  { value: "all", label: "All requests" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "closed", label: "Cancelled / Rejected" },
] as const;

type Filter = (typeof FILTERS)[number]["value"];

const ACTIVE = new Set(["requested", "accepted", "in-progress"]);

export function CustomerBookings() {
  const { data, error, isLoading, mutate } = useApi<Booking[]>(
    "/api/bookings/my",
  );
  const [filter, setFilter] = useState<Filter>("all");
  const [details, setDetails] = useState<Booking | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  const bookings = useMemo(() => data ?? [], [data]);

  const filtered = useMemo(() => {
    if (filter === "all") return bookings;
    if (filter === "active")
      return bookings.filter((booking) => ACTIVE.has(booking.status));
    if (filter === "completed")
      return bookings.filter((booking) => booking.status === "completed");
    return bookings.filter(
      (booking) =>
        booking.status === "cancelled" || booking.status === "rejected",
    );
  }, [bookings, filter]);

  async function confirmCancel() {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await apiFetch(`/api/bookings/${cancelTarget._id}/cancel`, {
        method: "PATCH",
      });
      toast.success("Request cancelled");
      setCancelTarget(null);
      await mutate();
    } catch (cancelError) {
      toast.error(
        cancelError instanceof Error
          ? cancelError.message
          : "Could not cancel this request.",
      );
    } finally {
      setCancelling(false);
    }
  }

  async function payNow(booking: Booking) {
    setPayingId(booking._id);
    try {
      const session = await apiFetch<{ url: string; sessionId: string }>(
        "/api/payments/create-checkout-session",
        {
          method: "POST",
          body: JSON.stringify({ bookingId: booking._id }),
        },
      );
      if (!session.url) {
        throw new Error("Stripe did not return a checkout URL.");
      }
      window.location.assign(session.url);
    } catch (paymentError) {
      toast.error(
        paymentError instanceof Error
          ? paymentError.message
          : "Could not start the payment.",
      );
      setPayingId(null);
    }
  }

  async function handleInvoice(booking: Booking) {
    setDownloadingInvoice(true);
    try {
      await downloadInvoice({ bookingId: booking._id });
    } catch (downloadError) {
      toast.error(
        downloadError instanceof Error
          ? downloadError.message
          : "Could not download the invoice.",
      );
    } finally {
      setDownloadingInvoice(false);
    }
  }

  if (error) {
    return <DashboardError message={error.message} onRetry={() => mutate()} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => {
          const count =
            item.value === "all"
              ? bookings.length
              : item.value === "active"
                ? bookings.filter((booking) => ACTIVE.has(booking.status))
                    .length
                : item.value === "completed"
                  ? bookings.filter(
                      (booking) => booking.status === "completed",
                    ).length
                  : bookings.filter(
                      (booking) =>
                        booking.status === "cancelled" ||
                        booking.status === "rejected",
                    ).length;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
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
          icon={ClipboardList}
          title={
            bookings.length === 0
              ? "No repair requests yet"
              : "Nothing in this view"
          }
          description={
            bookings.length === 0
              ? "Browse verified services and send your first repair request. You only pay after the job is completed."
              : "Try another filter to see the rest of your requests."
          }
          action={
            bookings.length === 0 ? (
              <Button
                className="h-10 rounded-full px-5"
                render={<Link href="/services" />}
              >
                Browse services
              </Button>
            ) : null
          }
        />
      ) : (
        <div className="rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Service</TableHead>
                <TableHead>Technician</TableHead>
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
                  <TableCell className="max-w-64 pl-4 whitespace-normal">
                    <p className="truncate font-medium">{booking.serviceTitle}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {booking.category} · requested {formatDate(booking.createdAt)}
                    </p>
                  </TableCell>
                  <TableCell>{booking.technicianName}</TableCell>
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
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Cancel request"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setCancelTarget(booking)}
                        >
                          <XCircle className="size-4" />
                        </Button>
                      )}

                      {booking.status === "completed" &&
                        booking.paymentStatus === "unpaid" && (
                          <Button
                            size="sm"
                            className="h-7 rounded-full px-3 text-xs font-semibold"
                            disabled={payingId === booking._id}
                            onClick={() => payNow(booking)}
                          >
                            {payingId === booking._id ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <CreditCard className="size-3.5" />
                            )}
                            Pay now
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
                  Requested {formatDate(details.createdAt)} · {details.category}
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

              <BookingReview
                booking={details}
                onReviewed={() => {
                  void mutate();
                }}
              />

              <div className="grid gap-3 rounded-xl border border-border bg-secondary/30 p-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    Technician
                  </p>
                  <p className="mt-1 font-medium">{details.technicianName}</p>
                </div>
                <div>
                  <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    Amount
                  </p>
                  <p className="mt-1 font-medium">
                    {formatCurrency(details.finalAmount || details.basePrice)}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                      Preferred date
                    </p>
                    <p className="mt-1">{formatDate(details.preferredDate)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                      Contact phone
                    </p>
                    <p className="mt-1">{details.customerPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:col-span-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                      Service address
                    </p>
                    <p className="mt-1">{details.address}</p>
                  </div>
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

              {details.status === "completed" &&
                details.paymentStatus === "unpaid" && (
                  <Button
                    className="h-10 w-full rounded-xl font-semibold"
                    disabled={payingId === details._id}
                    onClick={() => payNow(details)}
                  >
                    {payingId === details._id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <CreditCard className="size-4" />
                    )}
                    Pay {formatCurrency(details.finalAmount)}
                  </Button>
                )}

              {details.paymentStatus === "paid" && (
                <Button
                  variant="outline"
                  className="h-10 w-full rounded-xl"
                  disabled={downloadingInvoice}
                  onClick={() => handleInvoice(details)}
                >
                  {downloadingInvoice ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Download className="size-4" />
                  )}
                  Download invoice PDF
                </Button>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(cancelTarget)}
        onOpenChange={(open) => !open && setCancelTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this request?</AlertDialogTitle>
            <AlertDialogDescription>
              “{cancelTarget?.serviceTitle}” will be cancelled. You can always
              send a new request later if you still need the repair.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>Keep request</AlertDialogCancel>
            <AlertDialogAction
              disabled={cancelling}
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={confirmCancel}
            >
              {cancelling ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              Cancel request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
