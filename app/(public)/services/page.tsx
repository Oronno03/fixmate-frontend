import Link from "next/link";
import { Suspense } from "react";
import { SearchX, ShieldCheck, Sparkles } from "lucide-react";

import { ServiceCard } from "@/components/services/ServiceCard";
import { ServiceFilters } from "@/components/services/ServiceFilters";
import { ServicePagination } from "@/components/services/ServicePagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { serverFetchEnvelope } from "@/lib/api-server";
import { CATEGORIES, SERVICE_MODES } from "@/lib/constants";
import type { PaginationMeta, Service } from "@/lib/types";

export const instant = false;

export const metadata = {
  title: "Browse repair services",
  description:
    "Compare verified repair services for phones, laptops, ACs, refrigerators, TVs, washing machines, and electrical work.",
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ServicesPage({
  searchParams,
}: PageProps<"/services">) {
  const params = await searchParams;

  const search = first(params.search)?.trim() ?? "";
  const rawCategory = first(params.category) ?? "";
  const category = CATEGORIES.includes(rawCategory as never)
    ? rawCategory
    : "";
  const rawMode = first(params.serviceMode) ?? "";
  const serviceMode = SERVICE_MODES.includes(rawMode as never) ? rawMode : "";
  const rawSort = first(params.sort) ?? "newest";
  const sort = ["price_asc", "price_desc", "newest"].includes(rawSort)
    ? rawSort
    : "newest";
  const minPrice = first(params.minPrice) ?? "";
  const maxPrice = first(params.maxPrice) ?? "";
  const parsedPage = Number(first(params.page) ?? 1);
  const page =
    Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const pageSize = 12;

  const filterQuery = new URLSearchParams();
  if (search) filterQuery.set("search", search);
  if (category) filterQuery.set("category", category);
  if (serviceMode) filterQuery.set("serviceMode", serviceMode);
  if (sort) filterQuery.set("sort", sort);
  if (minPrice) filterQuery.set("minPrice", minPrice);
  if (maxPrice) filterQuery.set("maxPrice", maxPrice);

  const query = new URLSearchParams(filterQuery);
  query.set("page", String(page));
  query.set("pageSize", String(pageSize));

  const result = await serverFetchEnvelope<{
    data: Service[];
    pagination: PaginationMeta;
  }>(`/api/services?${query.toString()}`);

  const services = result?.data ?? [];
  const pagination: PaginationMeta = result?.pagination ?? {
    page,
    pageSize,
    total: services.length,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  };
  const rangeStart =
    pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.pageSize + 1;
  const rangeEnd = Math.min(
    pagination.total,
    pagination.page * pagination.pageSize,
  );

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-[-16rem] left-1/3 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-[120px]" />
        </div>
        <div className="container-page py-12 sm:py-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" />
                Admin-approved listings
              </span>
              <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
                Browse repair services
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Compare real prices, durations, and service modes from verified
                technicians. Every listing you see here is approved and
                currently available.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" />
              Search, filters, and sorting run on the server.
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-8 sm:py-10">
        <Suspense
          fallback={
            <div className="h-40 animate-pulse rounded-2xl border border-border bg-card" />
          }
        >
          <ServiceFilters />
        </Suspense>

        <div className="mt-8 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {pagination.total > 0 ? (
              <>
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {rangeStart}–{rangeEnd}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-foreground">
                  {pagination.total}
                </span>{" "}
                {pagination.total === 1 ? "service" : "services"}
              </>
            ) : (
              "No services found"
            )}
            {search ? (
              <>
                {" "}
                for{" "}
                <span className="font-medium text-foreground">
                  “{search}”
                </span>
              </>
            ) : null}
          </p>
          <Link
            href="/dashboard/technician/add-service"
            className="hidden text-xs font-semibold text-primary hover:underline sm:block"
          >
            Are you a technician? List a service →
          </Link>
        </div>

        {services.length > 0 ? (
          <>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {services.map((service, index) => (
                <ServiceCard
                  key={service._id}
                  service={service}
                  priority={index < 4}
                />
              ))}
            </div>
            <ServicePagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              filterParams={filterQuery.toString()}
            />
          </>
        ) : (
          <div className="mt-5">
            <EmptyState
              icon={SearchX}
              title="No services match your filters"
              description="Try a different keyword, category, or price range. New services are added regularly by verified technicians."
              action={
                <Button className="h-10 rounded-full px-5" render={<Link href="/services" />}>
                  Reset filters
                </Button>
              }
            />
          </div>
        )}
      </section>
    </>
  );
}
