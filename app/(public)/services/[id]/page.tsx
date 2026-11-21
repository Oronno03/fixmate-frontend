import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Star,
  Wrench,
} from "lucide-react";

import { RequestServiceForm } from "@/components/services/RequestServiceForm";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { serverFetch } from "@/lib/api-server";
import { formatCurrency, serviceImageSrc } from "@/lib/format";
import type { Service } from "@/lib/types";

export const instant = false;

export async function generateMetadata({ params }: PageProps<"/services/[id]">) {
  const { id } = await params;
  const service = await serverFetch<Service>(`/api/services/${id}`);
  return {
    title: service?.title ?? "Service details",
    description: service?.description,
  };
}

export default async function ServiceDetailsPage({
  params,
}: PageProps<"/services/[id]">) {
  const { id } = await params;
  const service = await serverFetch<Service>(`/api/services/${id}`);

  if (!service) {
    notFound();
  }

  const related =
    (await serverFetch<Service[]>(
      `/api/services?category=${encodeURIComponent(service.category)}&limit=4`,
    ))?.filter((item) => item._id !== service._id) ?? [];

  return (
    <>
      <section className="border-b border-border">
        <div className="container-page py-6">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-3.5" />
            Back to all services
          </Link>
        </div>
      </section>

      <section className="container-page grid gap-10 py-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
        <div>
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-border bg-secondary">
            <Image
              src={serviceImageSrc(service.image)}
              alt={service.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 65vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
              <Badge className="border-0 bg-background/90 text-foreground backdrop-blur">
                {service.category}
              </Badge>
              <Badge
                variant="outline"
                className="border-white/25 bg-black/40 text-white backdrop-blur"
              >
                {service.serviceMode}
              </Badge>
            </div>
          </div>

          <div className="mt-7">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
              >
                <BadgeCheck className="size-3.5" />
                Admin approved
              </Badge>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                <Star className="size-3.5 fill-primary" />
                4.9 · 120+ repairs
              </span>
            </div>

            <h1 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
              {service.title}
            </h1>

            <p className="mt-4 text-sm leading-relaxed whitespace-pre-line text-muted-foreground sm:text-base">
              {service.description}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Clock,
                label: "Estimated duration",
                value: service.estimatedDuration,
              },
              {
                icon: MapPin,
                label: "Service area",
                value: service.serviceArea,
              },
              {
                icon: CalendarClock,
                label: "Service mode",
                value: service.serviceMode,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-border bg-card p-4"
              >
                <item.icon className="size-4 text-primary" />
                <p className="mt-3 text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-semibold">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-lg font-semibold">
              What&apos;s included
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                "On-site diagnosis before any repair work",
                "Transparent final amount before payment",
                "30-day workmanship warranty",
                "Job status updates at every step",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-lg font-semibold">
              About the technician
            </h2>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
                <Wrench className="size-6" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-heading text-base font-semibold">
                    {service.technicianName}
                  </p>
                  <Badge
                    variant="outline"
                    className="border-primary/30 bg-primary/8 text-primary"
                  >
                    Verified pro
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Based in {service.serviceArea} · {service.category} specialist
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-secondary/50 px-3.5 py-2.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 shrink-0 text-primary" />
              Every technician is reviewed by the FixMate admin team before
              services go live.
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_30px_80px_-60px_rgba(0,0,0,0.9)]">
            <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              Starting price
            </p>
            <div className="mt-1 flex items-end gap-2">
              <p className="font-heading text-4xl font-extrabold tracking-tight text-primary">
                {formatCurrency(service.basePrice)}
              </p>
              <span className="pb-1 text-xs text-muted-foreground">
                base estimate
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              The technician confirms the final amount when the job is
              completed. You pay only after completion.
            </p>

            <div className="mt-5 border-t border-border pt-5">
              <RequestServiceForm
                serviceId={service._id}
                serviceTitle={service.title}
                basePrice={service.basePrice}
              />
            </div>

            <ul className="mt-5 space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-primary" />
                No upfront payment
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-primary" />
                Secure Stripe checkout
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-primary" />
                Cancel while the request is pending
              </li>
            </ul>
          </div>

          <div className="mt-4 rounded-2xl border border-border bg-card/60 p-4 text-xs leading-relaxed text-muted-foreground">
            Need a different category?{" "}
            <Link href="/services" className="font-semibold text-primary hover:underline">
              Browse all services
            </Link>
            .
          </div>
        </aside>
      </section>

      {related.length > 0 && (
        <section className="border-t border-border">
          <div className="container-page py-12">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">More in {service.category}</p>
                <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight">
                  Similar services
                </h2>
              </div>
              <Button
                variant="outline"
                className="h-9 rounded-full px-4"
                render={
                  <Link
                    href={`/services?category=${encodeURIComponent(service.category)}`}
                  />
                }
              >
                View category
              </Button>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.slice(0, 3).map((item) => (
                <ServiceCard key={item._id} service={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
