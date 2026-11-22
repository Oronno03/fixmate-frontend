import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function RatingStars({
  rating = 0,
  count,
  className,
  starClassName,
}: {
  rating?: number;
  count?: number;
  className?: string;
  starClassName?: string;
}) {
  const value = Number.isFinite(rating) ? Math.max(0, Math.min(5, rating)) : 0;
  const filled = Math.round(value);

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="inline-flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "size-3.5",
              star <= filled
                ? "fill-primary text-primary"
                : "text-muted-foreground/35",
              starClassName,
            )}
          />
        ))}
      </span>
      <span className="text-xs font-semibold text-foreground">
        {value > 0 ? value.toFixed(1) : "New"}
      </span>
      {typeof count === "number" && count > 0 ? (
        <span className="text-xs text-muted-foreground">
          ({count} {count === 1 ? "review" : "reviews"})
        </span>
      ) : null}
      <span className="sr-only">
        {value > 0
          ? `Rated ${value.toFixed(1)} out of 5${
              count ? ` from ${count} reviews` : ""
            }`
          : "No ratings yet"}
      </span>
    </span>
  );
}
