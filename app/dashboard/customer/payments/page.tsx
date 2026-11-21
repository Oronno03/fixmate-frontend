"use client";

import { CustomerPayments } from "@/components/dashboard/CustomerPayments";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function CustomerPaymentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Customer workspace"
        title="Payment history"
        description="Every completed repair you have paid for, with Stripe transaction details."
      />
      <CustomerPayments />
    </div>
  );
}
