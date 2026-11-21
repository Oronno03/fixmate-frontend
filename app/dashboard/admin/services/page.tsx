"use client";

import { AdminServices } from "@/components/dashboard/AdminServices";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function AdminServicesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin workspace"
        title="Service approvals"
        description="Approve new listings or reject services that do not meet FixMate standards. Only approved and available services appear publicly."
      />
      <AdminServices />
    </div>
  );
}
