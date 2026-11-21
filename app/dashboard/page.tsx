import { redirect } from "next/navigation";

import { ROLE_DASHBOARD } from "@/lib/constants";
import { requireUser } from "@/lib/session";
import type { Role } from "@/lib/types";

export const instant = false;

export default async function DashboardIndexPage() {
  const session = await requireUser();
  const role = session.user.role as Role;
  redirect(ROLE_DASHBOARD[role] ?? "/");
}
