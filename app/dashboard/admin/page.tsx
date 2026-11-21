"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CreditCard,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";

import { AdminCharts } from "@/components/dashboard/AdminCharts";
import {
  CardsSkeleton,
  DashboardError,
} from "@/components/dashboard/DataState";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { formatCurrency } from "@/lib/format";
import type { AdminStats } from "@/lib/types";

export default function AdminOverviewPage() {
  const { data, error, isLoading, mutate } = useApi<AdminStats>(
    "/api/admin/stats",
  );

  if (error) {
    return <DashboardError message={error.message} onRetry={() => mutate()} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin workspace"
        title="Platform overview"
        description="Monitor users, service approvals, bookings, and revenue across FixMate."
        actions={
          <>
            <Button
              variant="outline"
              className="h-9 rounded-full px-4"
              render={<Link href="/dashboard/admin/services" />}
            >
              <BookOpenCheck className="size-4" />
              Review services
            </Button>
            <Button
              className="h-9 rounded-full px-4 font-semibold"
              render={<Link href="/dashboard/admin/bookings" />}
            >
              All bookings
              <ArrowRight className="size-4" />
            </Button>
          </>
        }
      />

      {isLoading || !data ? (
        <CardsSkeleton cards={5} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatsCard
              label="Total users"
              value={data.totalUsers}
              hint={`${data.totalCustomers} customers`}
              icon={Users}
              accent="blue"
            />
            <StatsCard
              label="Technicians"
              value={data.totalTechnicians}
              hint="Verified service providers"
              icon={Wrench}
              accent="gold"
            />
            <StatsCard
              label="Pending services"
              value={data.pendingServices}
              hint="Waiting for approval"
              icon={ShieldCheck}
              accent="amber"
            />
            <StatsCard
              label="Total bookings"
              value={data.totalBookings}
              hint="All-time repair requests"
              icon={BookOpenCheck}
              accent="purple"
            />
            <StatsCard
              label="Revenue"
              value={formatCurrency(data.totalRevenue)}
              hint="Collected via Stripe"
              icon={CreditCard}
              accent="green"
            />
          </div>

          <AdminCharts stats={data} />
        </>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            title: "Manage users",
            description: "Review accounts and adjust roles.",
            href: "/dashboard/admin/users",
          },
          {
            title: "Approve services",
            description: "Keep the marketplace quality high.",
            href: "/dashboard/admin/services",
          },
          {
            title: "Transactions",
            description: "See every Stripe payment.",
            href: "/dashboard/admin/transactions",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <p className="font-heading text-sm font-semibold">{item.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {item.description}
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
              Open
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
