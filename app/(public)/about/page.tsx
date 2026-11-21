import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  HeartHandshake,
  ListChecks,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About FixMate",
  description:
    "FixMate connects customers with verified repair technicians and lets them pay only after the job is completed.",
};

const values = [
  {
    icon: ShieldCheck,
    title: "Verification first",
    description:
      "No service goes live until an admin reviews it. Customers only see approved, available listings.",
  },
  {
    icon: CreditCard,
    title: "Fair payment",
    description:
      "Technicians complete the work first. Customers review the final amount and pay through Stripe afterward.",
  },
  {
    icon: ListChecks,
    title: "Radical clarity",
    description:
      "Every request moves through a visible pipeline: requested, accepted, in progress, completed.",
  },
  {
    icon: HeartHandshake,
    title: "Accountability",
    description:
      "Ownership checks protect every booking, service, and payment. The right person, every time.",
  },
];

const numbers = [
  { value: "1,200+", label: "Repairs completed" },
  { value: "50+", label: "Verified technicians" },
  { value: "7", label: "Appliance categories" },
  { value: "4.9/5", label: "Customer rating" },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-[-18rem] left-1/4 h-[32rem] w-[32rem] rounded-full bg-primary/10 blur-[120px]" />
        </div>
        <div className="container-page py-16 sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            About FixMate
          </span>
          <h1 className="mt-5 max-w-3xl font-heading text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
            Repair services should feel{" "}
            <span className="gold-text">honest and simple.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            FixMate is a full-stack repair marketplace built for people who are
            tired of unclear quotes, unverified technicians, and paying before
            they see the result. We connect customers with reviewed
            professionals across seven appliance categories — and keep every
            step visible.
          </p>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {numbers.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-border bg-card p-6 text-center"
            >
              <p className="font-heading text-3xl font-extrabold text-primary">
                {item.value}
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-[#0D0D0B]">
        <div className="container-page grid gap-12 py-16 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="eyebrow">Our story</p>
            <h2 className="section-title mt-2">
              Built after one too many bad repair experiences
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <p>
              Finding a trustworthy technician usually means asking around,
              comparing vague estimates, and hoping the final bill matches what
              you were told. The best professionals are often invisible online,
              while the loudest listings are not always the safest.
            </p>
            <p>
              FixMate flips that model. Technicians publish structured services
              with real prices and durations. An admin reviews every listing
              before it appears publicly. Customers send a request with the
              details that matter, then follow a clear status pipeline from
              request to completion.
            </p>
            <p>
              Payment is the final step, not the first. Once the technician
              marks the job complete with a final amount, the customer pays
              securely through Stripe. No upfront charges, no mystery invoices.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="max-w-2xl">
          <p className="eyebrow">What we stand for</p>
          <h2 className="section-title mt-2">Four principles, no exceptions</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-primary/12 text-primary">
                <value.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-heading text-base font-semibold">
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-[#0D0D0B]">
        <div className="container-page py-16">
          <div className="grid gap-10 lg:grid-cols-3">
            <div>
              <p className="eyebrow">Three roles</p>
              <h2 className="section-title mt-2">One platform, three views</h2>
              <p className="section-copy mt-3">
                Every account gets a dashboard built around what they actually
                need to do.
              </p>
            </div>
            {[
              {
                icon: Users,
                role: "Customers",
                copy: "Browse approved services, send repair requests, cancel while pending, track progress, and pay after completion.",
              },
              {
                icon: Wrench,
                role: "Technicians",
                copy: "Publish services, manage availability, accept or reject requests, and move jobs through the pipeline.",
              },
              {
                icon: BadgeCheck,
                role: "Admins",
                copy: "Approve services, manage user roles, monitor every booking, and review platform revenue.",
              },
            ].map((role) => (
              <div
                key={role.role}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <role.icon className="size-5 text-primary" />
                <h3 className="mt-4 font-heading text-base font-semibold">
                  {role.role}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {role.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-[#211D12] via-card to-card p-8 sm:p-12">
          <div className="pointer-events-none absolute -top-24 -right-20 size-72 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative max-w-2xl">
            <p className="eyebrow">Join the marketplace</p>
            <h2 className="section-title mt-2">
              Whether you fix things or need things fixed
            </h2>
            <p className="section-copy mt-3">
              Create a free account in under a minute. Customers can book
              immediately; technicians can publish their first service and wait
              for admin approval.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                className="h-11 rounded-full px-6 font-semibold"
                render={<Link href="/sign-up" />}
              >
                Get started
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-full px-6"
                render={<Link href="/services" />}
              >
                Browse services
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
