"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Mail, Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { DashboardError } from "@/components/dashboard/DataState";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
import { RoleBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/hooks/use-api";
import { apiFetch } from "@/lib/api";
import type { Plan, Role } from "@/lib/types";

interface ProfileUser {
  _id: string;
  name: string;
  email: string;
  role: Role;
  plan?: Plan;
  image?: string | null;
  phone?: string | null;
  area?: string | null;
  bio?: string | null;
}

const inputClass =
  "h-10 w-full rounded-xl border border-border bg-input px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/80 focus:border-primary focus:ring-1 focus:ring-ring/40";

export function ProfileForm() {
  const { data, error, isLoading, mutate } = useApi<ProfileUser>(
    "/api/users/me",
  );

  if (error) {
    return <DashboardError message={error.message} onRetry={() => mutate()} />;
  }

  if (isLoading || !data) {
    return (
      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <Skeleton className="h-72 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return <ProfileFormInner user={data} onSaved={() => mutate()} />;
}

function ProfileFormInner({
  user,
  onSaved,
}: {
  user: ProfileUser;
  onSaved: () => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: user.name ?? "",
    phone: user.phone ?? "",
    area: user.area ?? "",
    bio: user.bio ?? "",
    image: user.image ?? "",
  });
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (form.name.trim().length < 2) {
      toast.error("Please enter your full name.");
      return;
    }
    if (form.phone.trim() && form.phone.trim().length < 6) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    if (form.area.trim() && form.area.trim().length < 2) {
      toast.error("Please enter a valid area.");
      return;
    }

    setLoading(true);
    try {
      await apiFetch<ProfileUser>("/api/users/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name: form.name.trim(),
          ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
          ...(form.area.trim() ? { area: form.area.trim() } : {}),
          ...(form.bio.trim() ? { bio: form.bio.trim() } : {}),
          image: form.image || null,
        }),
      });
      toast.success("Profile updated", {
        description: "Your new details are now visible across FixMate.",
      });
      onSaved();
      router.refresh();
    } catch (updateError) {
      toast.error(
        updateError instanceof Error
          ? updateError.message
          : "Could not update your profile.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
      <aside className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col items-center text-center">
          <div className="size-24 overflow-hidden rounded-full border border-border bg-secondary">
            {form.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.image}
                alt={form.name}
                className="size-full object-cover"
              />
            ) : (
              <span className="grid size-full place-items-center font-heading text-2xl font-bold text-primary">
                {form.name
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0]?.toUpperCase())
                  .join("") || "FM"}
              </span>
            )}
          </div>
          <h2 className="mt-4 font-heading text-lg font-semibold">
            {form.name || "Your name"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <RoleBadge role={user.role} />
            <Badge
              variant="outline"
              className={
                user.plan === "pro"
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground"
              }
            >
              {user.plan === "pro" ? "Pro plan" : "Free plan"}
            </Badge>
          </div>
        </div>

        <div className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="size-4 text-primary" />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="size-4 text-primary" />
            <span>Email and role are read-only.</span>
          </div>
        </div>
      </aside>

      <form
        onSubmit={submit}
        className="space-y-5 rounded-2xl border border-border bg-card p-6"
      >
        <div>
          <h2 className="font-heading text-lg font-semibold">Profile details</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep your contact details up to date so technicians and customers can
            reach you.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="name" className="text-xs font-medium">
              Full name
            </label>
            <input
              id="name"
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              className={inputClass}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-medium">
              Email address
            </label>
            <input
              id="email"
              value={user.email}
              readOnly
              disabled
              className={`${inputClass} cursor-not-allowed opacity-70`}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-xs font-medium">
              Phone
            </label>
            <input
              id="phone"
              value={form.phone}
              onChange={(event) =>
                setForm({ ...form, phone: event.target.value })
              }
              placeholder="01XXXXXXXXX"
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="area" className="text-xs font-medium">
              Area
            </label>
            <input
              id="area"
              value={form.area}
              onChange={(event) =>
                setForm({ ...form, area: event.target.value })
              }
              placeholder="e.g. Mirpur, Dhaka"
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="bio" className="text-xs font-medium">
              Bio
            </label>
            <textarea
              id="bio"
              value={form.bio}
              onChange={(event) =>
                setForm({ ...form, bio: event.target.value })
              }
              rows={4}
              maxLength={500}
              placeholder="A short introduction about you and your work."
              className="w-full resize-none rounded-xl border border-border bg-input px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/80 focus:border-primary focus:ring-1 focus:ring-ring/40"
            />
            <p className="text-right text-[0.7rem] text-muted-foreground">
              {form.bio.length}/500
            </p>
          </div>

          <div className="sm:col-span-2">
            <ImageUpload
              value={form.image}
              onChange={(url) => setForm({ ...form, image: url })}
              label="Profile photo"
              hint="A square photo works best. JPG, PNG or WebP up to 5 MB."
            />
          </div>
        </div>

        <div className="flex justify-end border-t border-border pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="h-10 rounded-xl px-5 font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="size-4" />
                Save changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
