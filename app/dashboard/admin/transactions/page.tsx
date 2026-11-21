"use client";

import { AdminTransactions } from "@/components/dashboard/AdminTransactions";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function AdminTransactionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin workspace"
        title="Transactions"
        description="Stripe payments collected for completed repairs, with total revenue and transaction details."
      />
      <AdminTransactions />
    </div>
  );
}
