"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  UserRound,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { clearApiTokenCache } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { ROLE_DASHBOARD } from "@/lib/constants";
import { isValidEmail, validatePassword } from "@/lib/validators";
import type { Role } from "@/lib/types";

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-input px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/80 focus:border-primary focus:ring-1 focus:ring-ring/40";

const ROLES: Array<{
  value: Extract<Role, "customer" | "technician">;
  label: string;
  description: string;
  icon: typeof UserRound;
}> = [
  {
    value: "customer",
    label: "Customer",
    description: "Book repairs and pay after completion",
    icon: UserRound,
  },
  {
    value: "technician",
    label: "Technician",
    description: "Publish services and manage repair jobs",
    icon: Wrench,
  },
];

export default function SignUpPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer" as Extract<Role, "customer" | "technician">,
    phone: "",
    area: "",
    bio: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (form.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (!isValidEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const passwordErrors = validatePassword(form.password);
    if (passwordErrors.length > 0) {
      setError(passwordErrors[0]);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { error: signUpError } = await authClient.signUp.email({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
        phone: form.phone.trim() || undefined,
        area: form.area.trim() || undefined,
        bio: form.bio.trim() || undefined,
      });

      if (signUpError) {
        setError(signUpError.message || "Failed to create your account.");
        return;
      }

      clearApiTokenCache();
      toast.success("Account created", {
        description:
          form.role === "technician"
            ? "Add your first service and wait for admin approval."
            : "Browse services and send your first repair request.",
      });
      router.push(ROLE_DASHBOARD[form.role]);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Create your FixMate account
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Join as a customer or technician — it takes less than a minute.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_30px_80px_-60px_rgba(0,0,0,0.9)] sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-medium">
                Full name
              </label>
              <input
                id="name"
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                placeholder="Nusrat Jahan"
                autoComplete="name"
                required
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-medium">
                Password
              </label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(event) =>
                    setForm({ ...form, password: event.target.value })
                  }
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  required
                  className={`${inputClass} pr-11 pl-10`}
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

            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-xs font-medium">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(event) =>
                  setForm({ ...form, confirmPassword: event.target.value })
                }
                placeholder="Repeat your password"
                autoComplete="new-password"
                required
                className={inputClass}
              />
            </div>
          </div>

          <p className="rounded-xl bg-secondary/40 px-3.5 py-2.5 text-[0.7rem] leading-relaxed text-muted-foreground">
            Passwords need at least 6 characters, including one uppercase and
            one lowercase letter.
          </p>

          <div className="space-y-2">
            <span className="text-xs font-medium">I want to join as</span>
            <div className="grid gap-3 sm:grid-cols-2">
              {ROLES.map((role) => {
                const active = form.role === role.value;
                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: role.value })}
                    className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                      active
                        ? "border-primary bg-primary/8"
                        : "border-border bg-input hover:border-primary/40"
                    }`}
                  >
                    <span
                      className={`grid size-9 shrink-0 place-items-center rounded-lg ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      <role.icon className="size-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">
                        {role.label}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                        {role.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-xs font-medium">
                Phone{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(event) =>
                  setForm({ ...form, phone: event.target.value })
                }
                placeholder="01XXXXXXXXX"
                autoComplete="tel"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="area" className="text-xs font-medium">
                Area{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </label>
              <input
                id="area"
                value={form.area}
                onChange={(event) =>
                  setForm({ ...form, area: event.target.value })
                }
                placeholder="Mirpur, Dhaka"
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="bio" className="text-xs font-medium">
              Bio{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </label>
            <textarea
              id="bio"
              value={form.bio}
              onChange={(event) =>
                setForm({ ...form, bio: event.target.value })
              }
              placeholder="Tell customers or technicians a little about yourself."
              rows={3}
              className="w-full resize-none rounded-xl border border-border bg-input px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/80 focus:border-primary focus:ring-1 focus:ring-ring/40"
            />
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
                Creating account…
              </>
            ) : (
              "Create account"
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            By creating an account you agree to FixMate&apos;s fair-use and
            service policies.
          </p>
        </form>

        <p className="mt-5 border-t border-border pt-5 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
