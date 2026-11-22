import {
  Check,
  CheckCircle2,
  Circle,
  CreditCard,
  XCircle,
} from "lucide-react";

import { formatDateTime } from "@/lib/format";
import type { Booking, BookingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STEPS: Array<{ status: BookingStatus; label: string }> = [
  { status: "requested", label: "Requested" },
  { status: "accepted", label: "Accepted" },
  { status: "in-progress", label: "In Progress" },
  { status: "completed", label: "Completed" },
];

const STATUS_INDEX: Record<BookingStatus, number> = {
  requested: 0,
  accepted: 1,
  "in-progress": 2,
  completed: 3,
  rejected: 0,
  cancelled: 0,
};

export function BookingTimeline({ booking }: { booking: Booking }) {
  const history = booking.statusHistory ?? [];
  const timestamps = new Map(
    history.map((entry) => [entry.status, entry.changedAt]),
  );

  if (booking.status === "rejected" || booking.status === "cancelled") {
    const changedAt =
      timestamps.get(booking.status) ?? booking.updatedAt ?? booking.createdAt;

    return (
      <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-4">
        <div className="flex items-start gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-destructive/15 text-destructive">
            <XCircle className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold">
              {booking.status === "rejected"
                ? "Request rejected"
                : "Request cancelled"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatDateTime(changedAt)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = STATUS_INDEX[booking.status] ?? 0;
  const isPaid = booking.paymentStatus === "paid";
  const paidAt = booking.paidAt ?? booking.updatedAt;

  return (
    <ol className="space-y-0">
      {STEPS.map((step, index) => {
        const complete = index < currentIndex;
        const active = index === currentIndex;
        const reached = complete || active;
        const changedAt = timestamps.get(step.status);

        return (
          <li key={step.status} className="relative flex gap-3 pb-5 last:pb-0">
            {index < STEPS.length - 1 || isPaid ? (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-7 left-3.5 h-[calc(100%-1.75rem)] w-px",
                  complete ? "bg-primary/60" : "bg-border",
                )}
              />
            ) : null}

            <span
              className={cn(
                "relative z-10 grid size-7 shrink-0 place-items-center rounded-full border",
                complete || (active && isPaid)
                  ? "border-primary bg-primary text-primary-foreground"
                  : active
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-card text-muted-foreground",
              )}
            >
              {complete ? (
                <Check className="size-3.5" />
              ) : active ? (
                <CheckCircle2 className="size-3.5" />
              ) : (
                <Circle className="size-2.5 fill-current" />
              )}
            </span>

            <div className="min-w-0 pt-0.5">
              <p
                className={cn(
                  "text-sm font-medium",
                  reached ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.label}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {changedAt
                  ? formatDateTime(changedAt)
                  : reached
                    ? formatDateTime(booking.updatedAt ?? booking.createdAt)
                    : "Pending"}
              </p>
            </div>
          </li>
        );
      })}

      <li className="relative flex gap-3">
        <span
          className={cn(
            "relative z-10 grid size-7 shrink-0 place-items-center rounded-full border",
            isPaid
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground",
          )}
        >
          <CreditCard className="size-3.5" />
        </span>
        <div className="min-w-0 pt-0.5">
          <p
            className={cn(
              "text-sm font-medium",
              isPaid ? "text-foreground" : "text-muted-foreground",
            )}
          >
            Paid
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {isPaid ? formatDateTime(paidAt) : "Payment due after completion"}
          </p>
        </div>
      </li>
    </ol>
  );
}
