"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { TechnicianServices } from "@/components/dashboard/TechnicianServices";

export default function MyServicesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Technician workspace"
        title="My services"
        description="Edit listings, toggle availability, and remove services you no longer offer. Editing a service sends it back to admin review."
      />
      <TechnicianServices />
    </div>
  );
}
