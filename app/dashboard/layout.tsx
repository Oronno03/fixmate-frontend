import type { ReactNode } from "react";

import {
  DashboardShell,
  type DashboardUser,
} from "@/components/dashboard/DashboardShell";
import { requireUser } from "@/lib/session";

export const instant = false;

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireUser();

  const user: DashboardUser = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role as DashboardUser["role"],
  };

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
