import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, Crown, MapPin, Wrench } from "lucide-react";

import { RatingStars } from "@/components/shared/RatingStars";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, serviceImageSrc } from "@/lib/format";
import type { Service } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ServiceCard({
  service,
  className,
  priority = false,
}: {
  service: Service;
  className?: string;
  priority?: boolean;
}) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_30px_60px_-40px_rgba(201,162,39,0.55)]",
        className,
      )}
    >
      <Link
        href={`/services/${service._id}`}
        className="relative block aspect-[16/10] overflow-hidden bg-secondary"
      >
        <Image
          src={serviceImageSrc(service.image)}
          alt={service.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge className="border-0 bg-background/85 text-foreground backdrop-blur">
            {service.category}
          </Badge>
          <Badge
            variant="outline"
            className="border-white/20 bg-black/35 text-white backdrop-blur"
          >
            {service.serviceMode}
          </Badge>
          {service.technicianPlan === "pro" ? (
            <Badge className="border-0 bg-primary text-primary-foreground">
              <Crown className="size-3" />
              Pro
            </Badge>
          ) : null}
        </div>
        <span className="absolute right-3 bottom-3 rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">
          {formatCurrency(service.basePrice)}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-base leading-snug font-semibold text-balance">
            <Link
              href={`/services/${service._id}`}
              className="transition-colors hover:text-primary"
            >
              {service.title}
            </Link>
          </h3>
          <RatingStars
            rating={service.ratingAverage}
            count={service.ratingCount}
            className="shrink-0"
          />
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {service.description}
        </p>

        <div className="mt-auto space-y-3 pt-1">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5 text-primary/80" />
              {service.estimatedDuration}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5 text-primary/80" />
              {service.serviceArea}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-3">
            <span className="flex min-w-0 items-center gap-2">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                <Wrench className="size-3.5" />
              </span>
              <span className="truncate text-xs font-medium text-muted-foreground">
                {service.technicianName}
              </span>
            </span>
            <Link
              href={`/services/${service._id}`}
              className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
            >
              View details
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
