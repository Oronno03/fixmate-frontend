"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CATEGORY_META, SERVICE_MODES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

const PRICE_RANGES = [
  { value: "", label: "Any price" },
  { value: "0-25", label: "Under $25" },
  { value: "25-50", label: "$25 – $50" },
  { value: "50-100", label: "$50 – $100" },
  { value: "100-", label: "$100 and above" },
];

const selectClass =
  "h-10 w-full appearance-none rounded-xl border border-border bg-input px-3 pr-9 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-ring/40";

export function ServiceFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const serviceMode = searchParams.get("serviceMode") ?? "";
  const sort = searchParams.get("sort") ?? "newest";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";

  const [search, setSearch] = useState(currentSearch);
  const [previousSearch, setPreviousSearch] = useState(currentSearch);

  if (currentSearch !== previousSearch) {
    setPreviousSearch(currentSearch);
    setSearch(currentSearch);
  }

  const priceValue = minPrice || maxPrice ? `${minPrice}-${maxPrice}` : "";

  function update(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    // Changing a filter starts a fresh result set, so drop any saved page.
    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function setParam(key: string, value: string) {
    update((params) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
  }

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setParam("search", search.trim());
  }

  function setPrice(value: string) {
    update((params) => {
      params.delete("minPrice");
      params.delete("maxPrice");
      if (value) {
        const [min, max] = value.split("-");
        if (min) params.set("minPrice", min);
        if (max) params.set("maxPrice", max);
      }
    });
  }

  const hasFilters = Boolean(
    currentSearch || category || serviceMode || minPrice || maxPrice || sort !== "newest",
  );

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <form onSubmit={submitSearch} className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search services by title or category…"
            aria-label="Search services"
            className="h-10 w-full rounded-xl border border-border bg-input pr-24 pl-10 text-sm outline-none transition-colors placeholder:text-muted-foreground/80 focus:border-primary focus:ring-1 focus:ring-ring/40"
          />
          <Button
            type="submit"
            size="sm"
            className="absolute top-1/2 right-1.5 h-7 -translate-y-1/2 rounded-lg px-3 text-xs font-semibold"
          >
            Search
          </Button>
        </form>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:w-auto">
          <label className="relative block lg:w-40">
            <span className="sr-only">Service mode</span>
            <select
              value={serviceMode}
              onChange={(event) => setParam("serviceMode", event.target.value)}
              className={selectClass}
            >
              <option value="">All modes</option>
              {SERVICE_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
            <SlidersHorizontal className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
          </label>

          <label className="relative block lg:w-40">
            <span className="sr-only">Price range</span>
            <select
              value={priceValue}
              onChange={(event) => setPrice(event.target.value)}
              className={selectClass}
            >
              {PRICE_RANGES.map((range) => (
                <option key={range.value || "any"} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            <SlidersHorizontal className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
          </label>

          <label className="relative col-span-2 block sm:col-span-1 lg:w-44">
            <span className="sr-only">Sort by</span>
            <select
              value={sort}
              onChange={(event) => setParam("sort", event.target.value)}
              className={selectClass}
            >
              {SORTS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <SlidersHorizontal className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
          </label>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setParam("category", "")}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
            !category
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/40 hover:text-foreground",
          )}
        >
          All categories
        </button>
        {CATEGORY_META.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setParam("category", item.value)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              category === item.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}

        {hasFilters && (
          <button
            type="button"
            onClick={() => router.push(pathname, { scroll: false })}
            className="ml-auto inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
          >
            <X className="size-3.5" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
