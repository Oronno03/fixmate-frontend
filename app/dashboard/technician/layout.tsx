import type { ReactNode } from "react";

import { requireRole } from "@/lib/session";

export const instant = false;

export default async function TechnicianLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole("technician");
  return children;
}
