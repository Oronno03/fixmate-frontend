"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { ImageUpload } from "@/components/dashboard/ImageUpload";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { CATEGORIES, SERVICE_MODES } from "@/lib/constants";
import type { Service } from "@/lib/types";
import { validateServiceForm } from "@/lib/validators";

const inputClass =
  "h-10 w-full rounded-xl border border-border bg-input px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/80 focus:border-primary focus:ring-1 focus:ring-ring/40";

const textareaClass =
  "w-full resize-none rounded-xl border border-border bg-input px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/80 focus:border-primary focus:ring-1 focus:ring-ring/40";

export function ServiceForm({
  service,
  onSuccess,
  compact = false,
}: {
  service?: Service;
  onSuccess?: () => void;
  compact?: boolean;
}) {
  const router = useRouter();
  const editing = Boolean(service);

  const [form, setForm] = useState({
    title: service?.title ?? "",
    category: service?.category ?? "Smartphone",
    description: service?.description ?? "",
    image: service?.image ?? "",
    basePrice: service ? String(service.basePrice) : "",
    estimatedDuration: service?.estimatedDuration ?? "",
    serviceMode: service?.serviceMode ?? "Home Visit",
    serviceArea: service?.serviceArea ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => {
      if (!previous[key]) return previous;
      const next = { ...previous };
      delete next[key];
      return next;
    });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateServiceForm(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setLoading(true);
    try {
      const body = JSON.stringify({
        title: form.title.trim(),
        category: form.category,
        description: form.description.trim(),
        image: form.image,
        basePrice: Number(form.basePrice),
        estimatedDuration: form.estimatedDuration.trim(),
        serviceMode: form.serviceMode,
        serviceArea: form.serviceArea.trim(),
      });

      if (editing && service) {
        await apiFetch<Service>(`/api/services/${service._id}`, {
          method: "PATCH",
          body,
        });
        toast.success("Service updated", {
          description: "It now needs admin approval again.",
        });
      } else {
        await apiFetch<Service>("/api/services", { method: "POST", body });
        toast.success("Service submitted", {
          description: "It will go live once an admin approves it.",
        });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard/technician/my-services");
        router.refresh();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save the service.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="title" className="text-xs font-medium">
            Service title
          </label>
          <input
            id="title"
            value={form.title}
            onChange={(event) => update("title", event.target.value)}
            placeholder="e.g. Split AC deep cleaning"
            className={inputClass}
            required
          />
          {errors.title && (
            <p className="text-[0.7rem] text-destructive">{errors.title}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="category" className="text-xs font-medium">
            Category
          </label>
          <select
            id="category"
            value={form.category}
            onChange={(event) =>
              update("category", event.target.value as typeof form.category)
            }
            className={inputClass}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="serviceMode" className="text-xs font-medium">
            Service mode
          </label>
          <select
            id="serviceMode"
            value={form.serviceMode}
            onChange={(event) =>
              update(
                "serviceMode",
                event.target.value as typeof form.serviceMode,
              )
            }
            className={inputClass}
          >
            {SERVICE_MODES.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="basePrice" className="text-xs font-medium">
            Base price (USD)
          </label>
          <input
            id="basePrice"
            type="number"
            min="1"
            step="0.01"
            value={form.basePrice}
            onChange={(event) => update("basePrice", event.target.value)}
            placeholder="45"
            className={inputClass}
            required
          />
          {errors.basePrice && (
            <p className="text-[0.7rem] text-destructive">{errors.basePrice}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="estimatedDuration" className="text-xs font-medium">
            Estimated duration
          </label>
          <input
            id="estimatedDuration"
            value={form.estimatedDuration}
            onChange={(event) =>
              update("estimatedDuration", event.target.value)
            }
            placeholder="e.g. 2-3 hours"
            className={inputClass}
            required
          />
          {errors.estimatedDuration && (
            <p className="text-[0.7rem] text-destructive">
              {errors.estimatedDuration}
            </p>
          )}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="serviceArea" className="text-xs font-medium">
            Service area
          </label>
          <input
            id="serviceArea"
            value={form.serviceArea}
            onChange={(event) => update("serviceArea", event.target.value)}
            placeholder="e.g. Mirpur, Dhaka"
            className={inputClass}
            required
          />
          {errors.serviceArea && (
            <p className="text-[0.7rem] text-destructive">
              {errors.serviceArea}
            </p>
          )}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="description" className="text-xs font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
            placeholder="What is included, what the customer should expect, and any warranty details (min. 20 characters)."
            rows={5}
            className={textareaClass}
            required
          />
          <div className="flex items-center justify-between">
            {errors.description ? (
              <p className="text-[0.7rem] text-destructive">
                {errors.description}
              </p>
            ) : (
              <span />
            )}
            <p className="text-[0.7rem] text-muted-foreground">
              {form.description.trim().length}/20 minimum
            </p>
          </div>
        </div>

        <div className="sm:col-span-2">
          <ImageUpload
            value={form.image}
            onChange={(url) => update("image", url)}
            label="Service image"
            hint="Upload a clear photo of the service or repaired appliance. JPG, PNG or WebP up to 5 MB."
          />
          {errors.image && (
            <p className="mt-1 text-[0.7rem] text-destructive">
              {errors.image}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-border pt-4">
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
              {editing ? "Save changes" : "Submit service"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
