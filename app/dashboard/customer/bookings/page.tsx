"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { CustomerBookings } from "@/components/dashboard/CustomerBookings";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";

export default function CustomerBookingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Customer workspace"
        title="My bookings"
        description="Track every repair request from pending to completed. Cancel while a request is still pending, and pay once the job is done."
        actions={
          <Button
            className="h-9 rounded-full px-4 font-semibold"
            render={<Link href="/services" />}
          >
            <Plus className="size-4" />
            New request
          </Button>
        }
      />
      <CustomerBookings />
    </div>
  );
}
