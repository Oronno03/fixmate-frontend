"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Crown, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/hooks/use-api";
import { apiFetch } from "@/lib/api";
import type { User } from "@/lib/types";

const FREE_LIMIT = 3;

export function ProPlanCard({ serviceCount }: { serviceCount: number }) {
  const router = useRouter();
  const { data: user, isLoading, mutate } = useApi<User>("/api/users/me");
  const [upgrading, setUpgrading] = useState(false);
  const handledCheckout = useRef(false);

  const isPro = user?.plan === "pro";

  useEffect(() => {
    if (handledCheckout.current) return;

    const params = new URLSearchParams(window.location.search);
    const status = params.get("pro");
    if (!status) return;

    handledCheckout.current = true;
    const sessionId = params.get("session_id");

    if (status === "success" && sessionId) {
      apiFetch<{ plan: string }>(
        `/api/payments/pro/verify?session_id=${encodeURIComponent(sessionId)}`,
      )
        .then(() => {
          toast.success("Welcome to FixMate Pro", {
            description: "You now have unlimited service listings and a Pro badge.",
          });
          void mutate();
        })
        .catch((error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Could not confirm your subscription.",
          );
        })
        .finally(() => router.replace("/dashboard/technician"));
    } else {
      if (status === "cancelled") {
        toast.info("Pro upgrade cancelled. You can try again anytime.");
      }
      router.replace("/dashboard/technician");
    }
  }, [mutate, router]);

  async function upgrade() {
    setUpgrading(true);
    try {
      const session = await apiFetch<{ url: string }>(
        "/api/payments/pro/checkout",
        { method: "POST" },
      );
      if (!session.url) {
        throw new Error("Stripe did not return a checkout URL.");
      }
      window.location.assign(session.url);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not start the Pro upgrade.",
      );
      setUpgrading(false);
    }
  }

  if (isLoading || !user) {
    return <Skeleton className="h-36 w-full rounded-2xl" />;
  }

  const used = Math.min(serviceCount, FREE_LIMIT);

  return (
    <div className="overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Crown className="size-5" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-heading text-lg font-semibold">
                {isPro ? "FixMate Pro" : "Free technician plan"}
              </h2>
              <Badge
                variant="outline"
                className={
                  isPro
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground"
                }
              >
                {isPro ? "Active" : "Free"}
              </Badge>
            </div>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {isPro
                ? "Unlimited service listings and a Verified Pro badge on every listing."
                : `You can publish ${FREE_LIMIT} services on the free plan. You are using ${used} of ${FREE_LIMIT}.`}
            </p>
            {!isPro && (
              <div className="mt-3 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(used / FREE_LIMIT) * 100}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {isPro ? (
          <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            Unlimited listings enabled
          </div>
        ) : (
          <Button
            className="h-10 shrink-0 rounded-full px-5 font-semibold"
            disabled={upgrading}
            onClick={upgrade}
          >
            {upgrading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Crown className="size-4" />
            )}
            Upgrade — $19/mo
          </Button>
        )}
      </div>
    </div>
  );
}
