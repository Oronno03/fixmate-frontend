"use client";

import { AdminUsers } from "@/components/dashboard/AdminUsers";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin workspace"
        title="Manage users"
        description="Review registered accounts and change roles. You cannot change your own role."
      />
      <AdminUsers />
    </div>
  );
}
