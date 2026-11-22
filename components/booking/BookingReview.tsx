"use client";

import { useState } from "react";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";

import { RatingStars } from "@/components/shared/RatingStars";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { Booking } from "@/lib/types";
import { cn } from "@/lib/utils";

export function BookingReview({
  booking,
  onReviewed,
}: {
  booking: Booking;
  onReviewed: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const canReview =
    booking.status === "completed" &&
    booking.paymentStatus === "paid" &&
    !booking.rating;

  if (booking.rating) {
    return (
      <div className="rounded-xl border border-border bg-secondary/30 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            Your review
          </p>
          <span className="text-xs text-muted-foreground">
            {formatDate(booking.reviewedAt)}
          </span>
        </div>
        <div className="mt-2">
          <RatingStars rating={booking.rating} />
        </div>
        {booking.review ? (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {booking.review}
          </p>
        ) : null}
      </div>
    );
  }

  if (!canReview) return null;

  async function submit() {
    if (rating < 1) {
      toast.error("Choose a star rating first.");
      return;
    }
    if (review.trim().length < 3) {
      toast.error("Please write a short review.");
      return;
    }

    setLoading(true);
    try {
      await apiFetch<Booking>(`/api/bookings/${booking._id}/review`, {
        method: "POST",
        body: JSON.stringify({ rating, review: review.trim() }),
      });
      toast.success("Thanks for your review", {
        description: "Your rating now appears on the service listing.",
      });
      setOpen(false);
      setRating(0);
      setReview("");
      onReviewed();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not submit your review.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-3 rounded-xl border border-primary/25 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">How was the repair?</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Your rating helps other customers choose the right technician.
          </p>
        </div>
        <Button
          className="h-9 shrink-0 rounded-full px-4 text-xs font-semibold"
          onClick={() => setOpen(true)}
        >
          <Star className="size-3.5" />
          Rate service
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rate this service</DialogTitle>
            <DialogDescription>
              {booking.serviceTitle} by {booking.technicianName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium">Your rating</p>
              <div
                className="mt-2 flex items-center gap-1"
                onMouseLeave={() => setHovered(0)}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    aria-label={`${star} star${star === 1 ? "" : "s"}`}
                    aria-pressed={rating === star}
                    onMouseEnter={() => setHovered(star)}
                    onClick={() => setRating(star)}
                    className="rounded-md p-1 transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <Star
                      className={cn(
                        "size-7 transition-colors",
                        star <= (hovered || rating)
                          ? "fill-primary text-primary"
                          : "text-muted-foreground/35",
                      )}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm font-semibold">
                  {hovered || rating
                    ? `${hovered || rating}/5`
                    : "Select"}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="review" className="text-xs font-medium">
                Short review
              </label>
              <textarea
                id="review"
                value={review}
                onChange={(event) => setReview(event.target.value)}
                rows={4}
                maxLength={1000}
                placeholder="What went well? Was the technician on time and professional?"
                className="w-full resize-none rounded-xl border border-border bg-input px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/80 focus:border-primary focus:ring-1 focus:ring-ring/40"
              />
              <p className="text-right text-[0.7rem] text-muted-foreground">
                {review.length}/1000
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="h-10"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="h-10 font-semibold"
              onClick={submit}
              disabled={loading}
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              Submit review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
