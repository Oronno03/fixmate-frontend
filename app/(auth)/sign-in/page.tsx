"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { clearApiTokenCache } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { ROLE_DASHBOARD } from "@/lib/constants";
import type { Role } from "@/lib/types";

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-input pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/80 focus:border-primary focus:ring-1 focus:ring-ring/40";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: signInError } = await authClient.signIn.email({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (signInError) {
        setError(signInError.message || "Invalid email or password.");
        return;
      }

      clearApiTokenCache();
      const role = (data?.user?.role as Role | undefined) ?? "customer";
      const destination =
        redirect && redirect.startsWith("/") && !redirect.startsWith("//")
          ? redirect
          : (ROLE_DASHBOARD[role] ?? "/dashboard");

      toast.success("Welcome back", {
        description: "You are signed in to FixMate.",
      });
      router.push(destination);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/12 text-primary">
          <LockKeyhole className="size-5" />
        </span>
        <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to manage your repairs, services, and payments.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_30px_80px_-60px_rgba(0,0,0,0.9)] sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-medium">
              Email address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-medium">
              Password
            </label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={form.password}
                onChange={(event) =>
                  setForm({ ...form, password: event.target.value })
                }
                placeholder="Enter your password"
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs text-destructive">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-xl font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-primary hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="h-96 w-full max-w-md animate-pulse rounded-2xl border border-border bg-card" />
      }
    >
      <SignInForm />
    </Suspense>
  );
}
