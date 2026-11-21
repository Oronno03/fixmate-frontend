"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Loader2,
  LockKeyhole,
  Send,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { formatCurrency, todayInputValue } from "@/lib/format";
import type { Booking } from "@/lib/types";

const inputClass =
  "h-10 w-full rounded-xl border border-border bg-input px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/80 focus:border-primary focus:ring-1 focus:ring-ring/40";

export function RequestServiceForm({
  serviceId,
  serviceTitle,
  basePrice,
}: {
  serviceId: string;
  serviceTitle: string;
  basePrice: number;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    address: "",
    preferredDate: todayInputValue(),
    problemDescription: "",
  });
  const [editedPhone, setEditedPhone] = useState<string | null>(null);

  const phone = editedPhone ?? user?.phone ?? "";

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setError("");
      setSubmitted(false);
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (phone.trim().length < 6) {
      setError("Please enter a valid phone number.");
      return;
    }
    if (form.address.trim().length < 5) {
      setError("Please enter your full address.");
      return;
    }
    if (!form.preferredDate) {
      setError("Please choose a preferred date.");
      return;
    }
    if (form.problemDescription.trim().length < 20) {
      setError("Please describe the problem in at least 20 characters.");
      return;
    }

    setLoading(true);
    try {
      await apiFetch<Booking>("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          serviceId,
          customerPhone: phone.trim(),
          address: form.address.trim(),
          preferredDate: form.preferredDate,
          problemDescription: form.problemDescription.trim(),
        }),
      });

      setSubmitted(true);
      toast.success("Repair request sent", {
        description: `${serviceTitle} · the technician will respond soon.`,
      });
      router.refresh();
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Could not send your request. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  if (isPending) {
    return (
      <Button disabled className="h-11 w-full rounded-xl font-semibold">
        <Loader2 className="size-4 animate-spin" />
        Checking your account…
      </Button>
    );
  }

  if (!user) {
    return (
      <div className="space-y-3">
        <Button
          className="h-11 w-full rounded-xl font-semibold"
          render={
            <Link href={`/sign-in?redirect=/services/${serviceId}`} />
          }
        >
          <LockKeyhole className="size-4" />
          Sign in to request
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          New to FixMate?{" "}
          <Link href="/sign-up" className="font-semibold text-primary hover:underline">
            Create a free account
          </Link>
        </p>
      </div>
    );
  }

  if (user.role !== "customer") {
    return (
      <div className="rounded-xl border border-border bg-secondary/40 p-4 text-center">
        <ShieldCheck className="mx-auto size-5 text-primary" />
        <p className="mt-2 text-sm font-medium">Only customers can book</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          You are signed in as a {user.role}. Switch to a customer account to
          send repair requests.
        </p>
      </div>
    );
  }

  return (
    <>
      <Button
        className="h-11 w-full rounded-xl font-semibold"
        onClick={() => handleOpenChange(true)}
      >
        <Send className="size-4" />
        Request this service
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {submitted ? (
            <div className="py-4 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-400/12 text-emerald-300">
                <CheckCircle2 className="size-7" />
              </span>
              <DialogTitle className="mt-4 text-xl">
                Request sent successfully
              </DialogTitle>
              <DialogDescription className="mx-auto mt-2 max-w-sm">
                Your request for “{serviceTitle}” is now pending. Track the
                status from your dashboard and pay only after the job is
                completed.
              </DialogDescription>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Button
                  className="h-10 rounded-xl font-semibold"
                  onClick={() =>
                    router.push("/dashboard/customer/bookings")
                  }
                >
                  View my bookings
                </Button>
                <Button
                  variant="outline"
                  className="h-10 rounded-xl"
                  onClick={() => handleOpenChange(false)}
                >
                  Keep browsing
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit}>
              <DialogHeader>
                <DialogTitle className="text-lg">
                  Request this service
                </DialogTitle>
                <DialogDescription>
                  {serviceTitle} · estimated {formatCurrency(basePrice)}. You
                  will not be charged until the job is completed.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-5 space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="customerPhone" className="text-xs font-medium">
                    Contact phone
                  </label>
                  <input
                    id="customerPhone"
                    value={phone}
                    onChange={(event) => setEditedPhone(event.target.value)}
                    placeholder="01XXXXXXXXX"
                    className={inputClass}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="address" className="text-xs font-medium">
                    Service address
                  </label>
                  <textarea
                    id="address"
                    value={form.address}
                    onChange={(event) =>
                      setForm({ ...form, address: event.target.value })
                    }
                    placeholder="House, road, area, city"
                    rows={2}
                    className="w-full resize-none rounded-xl border border-border bg-input px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/80 focus:border-primary focus:ring-1 focus:ring-ring/40"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="preferredDate"
                    className="flex items-center gap-1.5 text-xs font-medium"
                  >
                    <CalendarDays className="size-3.5 text-primary" />
                    Preferred date
                  </label>
                  <input
                    id="preferredDate"
                    type="date"
                    min={todayInputValue()}
                    value={form.preferredDate}
                    onChange={(event) =>
                      setForm({ ...form, preferredDate: event.target.value })
                    }
                    className={inputClass}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="problemDescription"
                    className="text-xs font-medium"
                  >
                    Describe the problem
                  </label>
                  <textarea
                    id="problemDescription"
                    value={form.problemDescription}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        problemDescription: event.target.value,
                      })
                    }
                    placeholder="What is happening with the device? Include any error messages, sounds, or recent changes (min. 20 characters)."
                    rows={4}
                    className="w-full resize-none rounded-xl border border-border bg-input px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/80 focus:border-primary focus:ring-1 focus:ring-ring/40"
                    required
                  />
                  <p className="text-right text-[0.7rem] text-muted-foreground">
                    {form.problemDescription.trim().length}/20 minimum
                  </p>
                </div>

                {error && (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-xs text-destructive">
                    {error}
                  </div>
                )}
              </div>

              <DialogFooter className="mt-5">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10"
                  onClick={() => handleOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-10 font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      Send request
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
