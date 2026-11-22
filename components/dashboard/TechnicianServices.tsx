"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

import { DashboardError, TableSkeleton } from "@/components/dashboard/DataState";
import { ServiceForm } from "@/components/dashboard/ServiceForm";
import { EmptyState } from "@/components/shared/EmptyState";
import { ApprovalStatusBadge } from "@/components/shared/status-badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
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
import { formatCurrency, formatDate, serviceImageSrc } from "@/lib/format";
import type { Service } from "@/lib/types";

export function TechnicianServices() {
  const { data, error, isLoading, mutate } = useApi<Service[]>(
    "/api/services/technician",
  );
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const services = useMemo(() => data ?? [], [data]);

  const counts = useMemo(
    () => ({
      total: services.length,
      approved: services.filter((service) => service.approvalStatus === "approved")
        .length,
      pending: services.filter((service) => service.approvalStatus === "pending")
        .length,
      available: services.filter((service) => service.isAvailable).length,
    }),
    [services],
  );

  async function toggleAvailability(service: Service, checked: boolean) {
    setTogglingId(service._id);
    try {
      await apiFetch<Service>(`/api/services/${service._id}/availability`, {
        method: "PATCH",
        body: JSON.stringify({ isAvailable: checked }),
      });
      toast.success(checked ? "Service enabled" : "Service disabled");
      await mutate();
    } catch (toggleError) {
      toast.error(
        toggleError instanceof Error
          ? toggleError.message
          : "Could not update availability.",
      );
    } finally {
      setTogglingId(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/services/${deleteTarget._id}`, {
        method: "DELETE",
      });
      toast.success("Service deleted");
      setDeleteTarget(null);
      await mutate();
    } catch (deleteError) {
      toast.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete this service.",
      );
    } finally {
      setDeleting(false);
    }
  }

  if (error) {
    return <DashboardError message={error.message} onRetry={() => mutate()} />;
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "Total services", value: counts.total },
          { label: "Approved", value: counts.approved },
          { label: "Pending review", value: counts.pending },
          { label: "Available now", value: counts.available },
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

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Editing a service sends it back to admin review.
        </p>
        <Button
          className="h-9 shrink-0 rounded-full px-4 font-semibold"
          render={<Link href="/dashboard/technician/add-service" />}
        >
          <Plus className="size-4" />
          Add service
        </Button>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} />
      ) : services.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No services yet"
          description="Publish your first repair service with a clear description, price, and photo. Once an admin approves it, customers can book you."
          action={
            <Button
              className="h-10 rounded-full px-5"
              render={<Link href="/dashboard/technician/add-service" />}
            >
              <Plus className="size-4" />
              Add your first service
            </Button>
          }
        />
      ) : (
        <div className="rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Approval</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Listed</TableHead>
                <TableHead className="pr-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service._id}>
                  <TableCell className="max-w-72 pl-4 whitespace-normal">
                    <div className="flex items-center gap-3">
                      <div className="size-11 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={serviceImageSrc(service.image)}
                          alt={service.title}
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{service.title}</p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {service.serviceMode} · {service.estimatedDuration}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(service.basePrice)}
                  </TableCell>
                  <TableCell>
                    <ApprovalStatusBadge status={service.approvalStatus} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        size="sm"
                        checked={service.isAvailable}
                        disabled={togglingId === service._id}
                        onCheckedChange={(checked) =>
                          toggleAvailability(service, checked)
                        }
                        aria-label={`Toggle availability for ${service.title}`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {service.isAvailable ? "On" : "Off"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(service.createdAt)}
                  </TableCell>
                  <TableCell className="pr-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Edit service"
                        onClick={() => setEditing(service)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Delete service"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setDeleteTarget(service)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog
        open={Boolean(editing)}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {editing && (
            <>
              <DialogHeader>
                <DialogTitle>Edit service</DialogTitle>
                <DialogDescription>
                  Changes are saved immediately and the service returns to
                  pending review.
                </DialogDescription>
              </DialogHeader>
              <ServiceForm
                key={editing._id}
                service={editing}
                compact
                onSuccess={async () => {
                  setEditing(null);
                  await mutate();
                }}
              />
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this service?</AlertDialogTitle>
            <AlertDialogDescription>
              “{deleteTarget?.title}” will be removed permanently. Existing
              bookings keep their service snapshot.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Keep service</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              {deleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              Delete service
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
