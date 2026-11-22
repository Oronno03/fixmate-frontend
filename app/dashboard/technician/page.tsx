"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Plus,
  Wrench,
} from "lucide-react";

import {
  CardsSkeleton,
  DashboardError,
  TableSkeleton,
} from "@/components/dashboard/DataState";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  ApprovalStatusBadge,
  BookingStatusBadge,
} from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Booking, Service } from "@/lib/types";

export default function TechnicianOverviewPage() {
  const servicesQuery = useApi<Service[]>("/api/services/technician");
  const bookingsQuery = useApi<Booking[]>("/api/bookings/technician");

  const services = useMemo(() => servicesQuery.data ?? [], [servicesQuery.data]);
  const bookings = useMemo(() => bookingsQuery.data ?? [], [bookingsQuery.data]);

  const stats = useMemo(
    () => ({
      totalServices: services.length,
      approved: services.filter(
        (service) => service.approvalStatus === "approved",
      ).length,
      pending: services.filter(
        (service) => service.approvalStatus === "pending",
      ).length,
      newRequests: bookings.filter((booking) => booking.status === "requested")
        .length,
      active: bookings.filter(
        (booking) =>
          booking.status === "accepted" || booking.status === "in-progress",
      ).length,
      completed: bookings.filter((booking) => booking.status === "completed")
        .length,
    }),
    [services, bookings],
  );

  const recent = bookings.slice(0, 5);
  const loading = servicesQuery.isLoading || bookingsQuery.isLoading;
  const error = servicesQuery.error || bookingsQuery.error;

  if (error) {
    return (
      <DashboardError
        message={error.message}
        onRetry={() => {
          servicesQuery.mutate();
          bookingsQuery.mutate();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Technician workspace"
        title="Your service business"
        description="Manage your listings, respond to new requests, and move jobs through the repair pipeline."
        actions={
          <>
            <Button
              variant="outline"
              className="h-9 rounded-full px-4"
              render={<Link href="/dashboard/technician/requests" />}
            >
              Manage requests
            </Button>
            <Button
              className="h-9 rounded-full px-4 font-semibold"
              render={<Link href="/dashboard/technician/add-service" />}
            >
              <Plus className="size-4" />
              Add service
            </Button>
          </>
        }
      />

      {loading ? (
        <CardsSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            label="Total services"
            value={stats.totalServices}
            hint={`${stats.approved} approved · ${stats.pending} pending`}
            icon={Wrench}
            accent="gold"
          />
          <StatsCard
            label="New requests"
            value={stats.newRequests}
            hint="Waiting for your response"
            icon={ClipboardList}
            accent="blue"
          />
          <StatsCard
            label="Active jobs"
            value={stats.active}
            hint="Accepted or in progress"
            icon={ClipboardList}
            accent="amber"
          />
          <StatsCard
            label="Completed"
            value={stats.completed}
            hint="Finished repairs"
            icon={CheckCircle2}
            accent="green"
          />
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr] lg:items-start">
        <div className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <h2 className="font-heading text-base font-semibold">
                Latest requests
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Newest repair jobs assigned to you
              </p>
            </div>
            <Link
              href="/dashboard/technician/requests"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              View all
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="p-5">
            {loading ? (
              <TableSkeleton rows={3} />
            ) : recent.length === 0 ? (
              <EmptyState
                icon={ClipboardList}
                title="No requests yet"
                description="Once customers book your approved services, their requests will appear here."
                action={
                  <Button
                    className="h-10 rounded-full px-5"
                    render={<Link href="/dashboard/technician/add-service" />}
                  >
                    Publish a service
                  </Button>
                }
              />
            ) : (
              <ul className="divide-y divide-border">
                {recent.map((booking) => (
                  <li
                    key={booking._id}
                    className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {booking.serviceTitle}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {booking.customerName} ·{" "}
                        {formatDate(booking.preferredDate)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-sm font-semibold">
                        {formatCurrency(
                          booking.finalAmount || booking.basePrice,
                        )}
                      </span>
                      <BookingStatusBadge status={booking.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-heading text-base font-semibold">
              Your services
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Keep listings accurate. Editing a service sends it back for admin
              approval.
            </p>
            <div className="mt-4 space-y-2">
              {services.slice(0, 3).map((service) => (
                <div
                  key={service._id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-border bg-secondary/30 px-3 py-2.5"
                >
                  <span className="min-w-0 truncate text-xs font-medium">
                    {service.title}
                  </span>
                  <ApprovalStatusBadge status={service.approvalStatus} />
                </div>
              ))}
              {services.length === 0 && (
                <p className="rounded-xl border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
                  No services published yet.
                </p>
              )}
            </div>
            <Button
              variant="outline"
              className="mt-4 h-9 w-full rounded-full"
              render={<Link href="/dashboard/technician/my-services" />}
            >
              Manage my services
            </Button>
          </div>

          <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card p-5">
            <p className="eyebrow">Pipeline</p>
            <h2 className="mt-2 font-heading text-lg font-semibold">
              Keep jobs moving
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Accept a request, start the work, then mark it complete with the
              final amount so the customer can pay.
            </p>
            <Button
              className="mt-4 h-9 rounded-full px-4 font-semibold"
              render={<Link href="/dashboard/technician/requests" />}
            >
              Open requests
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
