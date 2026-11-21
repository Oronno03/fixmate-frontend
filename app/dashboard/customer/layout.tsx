import type { ReactNode } from "react";

import { requireRole } from "@/lib/session";

export const instant = false;

export default async function CustomerLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole("customer");
  return children;
}
