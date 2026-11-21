"use client";

import { useMemo, useState } from "react";
import { Check, Loader2, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";

import { DashboardError, TableSkeleton } from "@/components/dashboard/DataState";
import { EmptyState } from "@/components/shared/EmptyState";
import { ApprovalStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
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
import type { ApprovalStatus, Service } from "@/lib/types";
import { cn } from "@/lib/utils";

const FILTERS: Array<{ value: ApprovalStatus | "all"; label: string }> = [
  { value: "all", label: "All services" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export function AdminServices() {
  const { data, error, isLoading, mutate } = useApi<Service[]>(
    "/api/admin/services",
  );
  const [filter, setFilter] = useState<ApprovalStatus | "all">("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const services = useMemo(() => data ?? [], [data]);

  const filtered = useMemo(
    () =>
      filter === "all"
        ? services
        : services.filter((service) => service.approvalStatus === filter),
    [services, filter],
  );

  async function setApproval(service: Service, approvalStatus: ApprovalStatus) {
    setBusyId(service._id);
    try {
      await apiFetch(`/api/admin/services/${service._id}/approval`, {
        method: "PATCH",
        body: JSON.stringify({ approvalStatus }),
      });
      toast.success(`Service ${approvalStatus}`);
      await mutate();
    } catch (approvalError) {
      toast.error(
        approvalError instanceof Error
          ? approvalError.message
          : "Could not update this service.",
      );
    } finally {
      setBusyId(null);
    }
  }

  if (error) {
    return <DashboardError message={error.message} onRetry={() => mutate()} />;
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Pending review", value: services.filter((s) => s.approvalStatus === "pending").length },
          { label: "Approved", value: services.filter((s) => s.approvalStatus === "approved").length },
          { label: "Rejected", value: services.filter((s) => s.approvalStatus === "rejected").length },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-4"
          >
            <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              {stat.label}
            </p>
            <p className="mt-1.5 font-heading text-2xl font-bold">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => (
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
          </button>
        ))}
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title={services.length === 0 ? "No services yet" : "Nothing in this view"}
          description={
            services.length === 0
              ? "Services submitted by technicians will appear here for approval."
              : "Try another approval filter to see the rest of the services."
          }
        />
      ) : (
        <div className="rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Service</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="pr-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((service) => (
                <TableRow key={service._id}>
                  <TableCell className="max-w-72 pl-4 whitespace-normal">
                    <div className="flex items-center gap-3">
                      <div className="size-11 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={service.image}
                          alt={service.title}
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{service.title}</p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {service.serviceMode} · {service.serviceArea}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{service.technicianName}</p>
                    <p className="text-xs text-muted-foreground">
                      {service.technicianEmail}
                    </p>
                  </TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(service.basePrice)}
                  </TableCell>
                  <TableCell>
                    <ApprovalStatusBadge status={service.approvalStatus} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(service.createdAt)}
                  </TableCell>
                  <TableCell className="pr-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {busyId === service._id && (
                        <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
                      )}
                      {service.approvalStatus !== "approved" && (
                        <Button
                          size="sm"
                          className="h-7 rounded-full px-3 text-xs font-semibold"
                          disabled={busyId === service._id}
                          onClick={() => setApproval(service, "approved")}
                        >
                          <Check className="size-3.5" />
                          Approve
                        </Button>
                      )}
                      {service.approvalStatus !== "rejected" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 rounded-full px-3 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                          disabled={busyId === service._id}
                          onClick={() => setApproval(service, "rejected")}
                        >
                          <X className="size-3.5" />
                          Reject
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
    </div>
  );
}
