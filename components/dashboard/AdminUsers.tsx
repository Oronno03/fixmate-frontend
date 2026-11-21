"use client";

import { useState } from "react";
import { Loader2, ShieldCheck, Users } from "lucide-react";
import { toast } from "sonner";

import { DashboardError, TableSkeleton } from "@/components/dashboard/DataState";
import { EmptyState } from "@/components/shared/EmptyState";
import { RoleBadge } from "@/components/shared/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { authClient } from "@/lib/auth-client";
import { formatDate, initials } from "@/lib/format";
import type { Role } from "@/lib/types";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: Role;
  image?: string | null;
  phone?: string | null;
  area?: string | null;
  createdAt?: string;
}

const ROLES: Role[] = ["customer", "technician", "admin"];

export function AdminUsers() {
  const { data, error, isLoading, mutate } =
    useApi<AdminUser[]>("/api/admin/users");
  const { data: session } = authClient.useSession();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const users = data ?? [];
  const currentUserId = session?.user?.id;

  async function changeRole(user: AdminUser, role: Role) {
    if (role === user.role) return;
    setUpdatingId(user._id);
    try {
      await apiFetch(`/api/admin/users/${user._id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });
      toast.success(`${user.name} is now a ${role}`);
      await mutate();
    } catch (roleError) {
      toast.error(
        roleError instanceof Error
          ? roleError.message
          : "Could not update this role.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  if (error) {
    return <DashboardError message={error.message} onRetry={() => mutate()} />;
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Total users", value: users.length },
          {
            label: "Technicians",
            value: users.filter((user) => user.role === "technician").length,
          },
          {
            label: "Customers",
            value: users.filter((user) => user.role === "customer").length,
          },
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

      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description="Registered customers, technicians, and admins will appear here."
        />
      ) : (
        <div className="rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">User</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="pr-4 text-right">Change role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const isSelf = user._id === currentUserId;
                return (
                  <TableRow key={user._id}>
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          {user.image ? (
                            <AvatarImage src={user.image} alt={user.name} />
                          ) : null}
                          <AvatarFallback className="bg-primary/15 text-[0.6rem] font-semibold text-primary">
                            {initials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 truncate font-medium">
                            {user.name}
                            {isSelf && (
                              <ShieldCheck className="size-3.5 text-primary" />
                            )}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.phone || "—"}</TableCell>
                    <TableCell>{user.area || "—"}</TableCell>
                    <TableCell>
                      <RoleBadge role={user.role} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="pr-4 text-right">
                      {isSelf ? (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <ShieldCheck className="size-3.5" />
                          Your account
                        </span>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          {updatingId === user._id && (
                            <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
                          )}
                          <select
                            value={user.role}
                            disabled={updatingId === user._id}
                            onChange={(event) =>
                              changeRole(user, event.target.value as Role)
                            }
                            className="h-8 rounded-lg border border-border bg-input px-2 text-xs outline-none focus:border-primary"
                          >
                            {ROLES.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
