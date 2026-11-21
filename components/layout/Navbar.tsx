"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clearApiTokenCache } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import {
  ROLE_DASHBOARD,
  ROLE_LABELS,
  ROLE_STYLES,
} from "@/lib/constants";
import { initials } from "@/lib/format";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

import { Logo } from "./Logo";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);

  const user = session?.user;
  const role = (user?.role ?? "customer") as Role;
  const dashboardHref = user ? (ROLE_DASHBOARD[role] ?? "/dashboard") : "/dashboard";

  async function signOut() {
    await authClient.signOut();
    clearApiTokenCache();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isPending ? (
            <div className="h-9 w-36 animate-pulse rounded-full bg-secondary" />
          ) : user ? (
            <>
              <Link
                href={dashboardHref}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <LayoutDashboard className="size-4" />
                Dashboard
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pr-2 pl-1 text-sm transition-colors hover:border-primary/40">
                  <Avatar size="sm">
                    {user.image ? (
                      <AvatarImage src={user.image} alt={user.name} />
                    ) : null}
                    <AvatarFallback className="bg-primary/15 text-[0.65rem] font-semibold text-primary">
                      {initials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-28 truncate font-medium">
                    {user.name}
                  </span>
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                  <DropdownMenuLabel className="px-2 py-2">
                    <span className="block truncate text-sm font-semibold text-foreground">
                      {user.name}
                    </span>
                    <span className="mt-0.5 block truncate text-xs font-normal text-muted-foreground">
                      {user.email}
                    </span>
                    <span
                      className={cn(
                        "mt-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold",
                        ROLE_STYLES[role],
                      )}
                    >
                      {ROLE_LABELS[role]}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer gap-2 px-2 py-2"
                    onClick={() => router.push(dashboardHref)}
                  >
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer gap-2 px-2 py-2"
                    onClick={() => router.push("/dashboard/profile")}
                  >
                    <UserRound className="size-4" />
                    Update profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    className="cursor-pointer gap-2 px-2 py-2"
                    onClick={signOut}
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="h-9 rounded-full px-4"
                render={<Link href="/sign-in" />}
              >
                Sign in
              </Button>
              <Button
                className="h-9 rounded-full px-5 font-semibold"
                render={<Link href="/sign-up" />}
              >
                Get started
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="grid size-10 place-items-center rounded-xl border border-border bg-card text-foreground md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-3 border-t border-border pt-3">
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <Avatar>
                      {user.image ? (
                        <AvatarImage src={user.image} alt={user.name} />
                      ) : null}
                      <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                        {initials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="h-10 justify-start"
                    render={
                      <Link
                        href={dashboardHref}
                        onClick={() => setOpen(false)}
                      />
                    }
                  >
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 justify-start"
                    render={
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setOpen(false)}
                      />
                    }
                  >
                    <UserRound className="size-4" />
                    Update profile
                  </Button>
                  <Button
                    variant="destructive"
                    className="h-10 justify-start"
                    onClick={signOut}
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="h-10"
                    render={
                      <Link href="/sign-in" onClick={() => setOpen(false)} />
                    }
                  >
                    Sign in
                  </Button>
                  <Button
                    className="h-10 font-semibold"
                    render={
                      <Link href="/sign-up" onClick={() => setOpen(false)} />
                    }
                  >
                    Get started
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
