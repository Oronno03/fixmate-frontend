"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { TechnicianRequests } from "@/components/dashboard/TechnicianRequests";

export default function TechnicianRequestsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Technician workspace"
        title="Manage requests"
        description="Accept or reject new requests, start work, and mark jobs complete with the final amount. The customer pays only after completion."
      />
      <TechnicianRequests />
    </div>
  );
}
