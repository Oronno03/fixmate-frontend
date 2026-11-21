"use client";

import { AdminBookings } from "@/components/dashboard/AdminBookings";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function AdminBookingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin workspace"
        title="All bookings"
        description="Every repair request across the platform, with status and payment state."
      />
      <AdminBookings />
    </div>
  );
}
