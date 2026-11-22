import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

function pageItems(current: number, total: number): Array<number | "gap"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const items: Array<number | "gap"> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) items.push("gap");
  for (let page = start; page <= end; page += 1) items.push(page);
  if (end < total - 1) items.push("gap");
  items.push(total);

  return items;
}

export function ServicePagination({
  page,
  totalPages,
  filterParams,
}: {
  page: number;
  totalPages: number;
  filterParams: string;
}) {
  if (totalPages <= 1) return null;

  function hrefFor(target: number) {
    const params = new URLSearchParams(filterParams);
    if (target > 1) params.set("page", String(target));
    else params.delete("page");
    const query = params.toString();
    return query ? `/services?${query}` : "/services";
  }

  const items = pageItems(page, totalPages);

  return (
    <nav
      aria-label="Service results pages"
      className="mt-8 flex flex-wrap items-center justify-center gap-1.5"
    >
      {page > 1 ? (
        <Link
          href={hrefFor(page - 1)}
          rel="prev"
          className="inline-flex h-9 items-center gap-1 rounded-full border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <ChevronLeft className="size-3.5" />
          Previous
        </Link>
      ) : (
        <span className="inline-flex h-9 items-center gap-1 rounded-full border border-border px-3 text-xs font-medium text-muted-foreground/40">
          <ChevronLeft className="size-3.5" />
          Previous
        </span>
      )}

      <div className="flex items-center gap-1">
        {items.map((item, index) =>
          item === "gap" ? (
            <span
              key={`gap-${index}`}
              className="grid size-9 place-items-center text-xs text-muted-foreground"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <Link
              key={item}
              href={hrefFor(item)}
              aria-current={item === page ? "page" : undefined}
              className={cn(
                "grid size-9 place-items-center rounded-full border text-xs font-semibold transition-colors",
                item === page
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {item}
            </Link>
          ),
        )}
      </div>

      {page < totalPages ? (
        <Link
          href={hrefFor(page + 1)}
          rel="next"
          className="inline-flex h-9 items-center gap-1 rounded-full border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          Next
          <ChevronRight className="size-3.5" />
        </Link>
      ) : (
        <span className="inline-flex h-9 items-center gap-1 rounded-full border border-border px-3 text-xs font-medium text-muted-foreground/40">
          Next
          <ChevronRight className="size-3.5" />
        </span>
      )}
    </nav>
  );
}
