"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { ServiceForm } from "@/components/dashboard/ServiceForm";
import { Button } from "@/components/ui/button";

export default function AddServicePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Technician workspace"
        title="Add a repair service"
        description="Describe the service clearly, set a fair base price, and upload a photo. New services are reviewed by an admin before going live."
        actions={
          <Button
            variant="outline"
            className="h-9 rounded-full px-4"
            render={<Link href="/dashboard/technician/my-services" />}
          >
            <ArrowLeft className="size-4" />
            Back to my services
          </Button>
        }
      />

      <div className="max-w-3xl rounded-2xl border border-border bg-card p-5 sm:p-6">
        <ServiceForm />
      </div>
    </div>
  );
}
