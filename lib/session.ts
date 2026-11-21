import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "./auth";
import { ROLE_DASHBOARD } from "./constants";
import type { Role } from "./types";

export async function getServerSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireUser() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/sign-in");
  }
  return session;
}

export async function requireRole(role: Role) {
  const session = await requireUser();
  const userRole = session.user.role as Role;

  if (userRole !== role) {
    redirect(ROLE_DASHBOARD[userRole] ?? "/");
  }

  return session;
}
