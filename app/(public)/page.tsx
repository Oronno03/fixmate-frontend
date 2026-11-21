import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Quote,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Wrench,
} from "lucide-react";

import { ServiceCard } from "@/components/services/ServiceCard";
import { Button } from "@/components/ui/button";
import { serverFetch } from "@/lib/api-server";
import { CATEGORY_META, TRUST_POINTS } from "@/lib/constants";
import type { Service } from "@/lib/types";

export const instant = false;

const steps = [
  {
    icon: Search,
    title: "Find the right service",
    description:
      "Search by appliance or browse categories to compare verified technicians, prices, and durations.",
  },
  {
    icon: ClipboardList,
    title: "Send a repair request",
    description:
      "Share your device issue, preferred date, and address. Your request goes straight to the technician.",
  },
  {
    icon: Wrench,
    title: "Track the job live",
    description:
      "Follow every step from requested to accepted to in progress. No more guessing where things stand.",
  },
  {
    icon: CreditCard,
    title: "Pay after completion",
    description:
      "Once the technician marks the job complete, review the final amount and pay securely with Stripe.",
  },
];

const testimonials = [
  {
    name: "Sadia Rahman",
    role: "Customer · Dhanmondi",
    quote:
      "My AC stopped cooling in the middle of summer. I found a verified technician, booked a slot, and it was fixed the same afternoon. Paying after completion felt fair.",
    initials: "SR",
  },
  {
    name: "Tanvir Ahmed",
    role: "Customer · Mirpur",
    quote:
      "The status timeline is what sold me. I knew exactly when my laptop was accepted, in progress, and ready. The final price matched the quote.",
    initials: "TA",
  },
  {
    name: "Rahim Uddin",
    role: "Technician · FixMate Pro",
    quote:
      "As a technician I get serious requests, not endless messages. I manage my services, accept jobs, and mark them complete from one dashboard.",
    initials: "RU",
  },
];

export default async function HomePage() {
  const services =
    (await serverFetch<Service[]>("/api/services?limit=6&sort=newest")) ?? [];

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-[-18rem] left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-primary/12 blur-[120px]" />
          <div className="absolute right-[-10rem] bottom-[-14rem] h-[28rem] w-[28rem] rounded-full bg-[#6F5D28]/25 blur-[110px]" />
          <div
            className="absolute inset-0 opacity-[0.16]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #302E29 1px, transparent 1px), linear-gradient(to bottom, #302E29 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage:
                "radial-gradient(ellipse at 50% 0%, black 20%, transparent 72%)",
            }}
          />
        </div>

        <div className="container-page grid gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3.5 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              Verified repair marketplace
            </span>

            <h1 className="mt-6 font-heading text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Repairs done right,
              <br />
              <span className="gold-text">the first time.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Book trusted technicians for smartphones, laptops, ACs,
              refrigerators, TVs, washing machines, and home electrical work.
              Transparent pricing. Live job tracking. Pay only after the job is
              complete.
            </p>

            <form
              action="/services"
              className="mt-8 flex max-w-xl items-center gap-2 rounded-2xl border border-border bg-card/80 p-2 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.9)] backdrop-blur"
            >
              <span className="grid size-10 shrink-0 place-items-center text-muted-foreground">
                <Search className="size-4.5" />
              </span>
              <input
                type="search"
                name="search"
                placeholder="What needs fixing? e.g. AC, iPhone screen, laptop"
                aria-label="Search repair services"
                className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/80"
              />
              <Button
                type="submit"
                className="h-10 shrink-0 rounded-xl px-5 font-semibold"
              >
                Search
              </Button>
            </form>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <BadgeCheck className="size-4 text-primary" />
                Background-checked pros
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                No payment upfront
              </span>
              <span className="inline-flex items-center gap-2">
                <Star className="size-4 fill-primary text-primary" />
                4.9 average rating
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/8 blur-2xl" />
            <div className="gold-ring rounded-3xl border border-border bg-card/95 p-5 backdrop-blur sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                    Live repair request
                  </p>
                  <p className="mt-1 font-heading text-lg font-semibold">
                    Split AC deep cleaning
                  </p>
                </div>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[0.65rem] font-semibold text-emerald-300">
                  In progress
                </span>
              </div>

              <div className="mt-5 space-y-3 rounded-2xl border border-border bg-background/60 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Technician</span>
                  <span className="font-medium">Rahim Uddin</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Scheduled</span>
                  <span className="font-medium">Today · 3:00 PM</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Estimated</span>
                  <span className="font-medium">$35.00</span>
                </div>
              </div>

              <div className="mt-5">
                <div className="relative ml-1 border-l border-dashed border-border pl-5">
                  {[
                    { label: "Requested", done: true, time: "9:12 AM" },
                    { label: "Accepted", done: true, time: "9:26 AM" },
                    { label: "In progress", done: true, time: "2:41 PM" },
                    { label: "Completed", done: false, time: "Pending" },
                  ].map((step, index) => (
                    <div
                      key={step.label}
                      className={
                        index === 3 ? "relative pb-0" : "relative pb-5"
                      }
                    >
                      <span
                        className={`absolute top-0.5 -left-[1.72rem] grid size-3.5 place-items-center rounded-full ring-4 ring-card ${
                          step.done ? "bg-primary" : "bg-secondary"
                        }`}
                      />
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className={`text-sm font-medium ${
                            step.done ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {step.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/8 p-3.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <CreditCard className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold">
                    Payment unlocks after completion
                  </p>
                  <p className="text-[0.7rem] text-muted-foreground">
                    You approve the final amount before paying.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border bg-background/60">
          <div className="container-page grid grid-cols-2 gap-6 py-7 sm:grid-cols-4">
            {[
              { value: "1,200+", label: "Repairs completed" },
              { value: "4.9/5", label: "Average rating" },
              { value: "24h", label: "Avg. response time" },
              { value: "7", label: "Repair categories" },
            ].map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <p className="font-heading text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Fresh on FixMate</p>
            <h2 className="section-title mt-2">Featured repair services</h2>
            <p className="section-copy mt-3 max-w-xl">
              Hand-picked, admin-approved services from verified technicians.
              Every listing shows the real price before you book.
            </p>
          </div>
          <Button
            variant="outline"
            className="h-10 shrink-0 rounded-full px-5"
            render={<Link href="/services" />}
          >
            Browse all services
            <ArrowRight className="size-4" />
          </Button>
        </div>

        {services.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <ServiceCard
                key={service._id}
                service={service}
                priority={index < 3}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card/60 px-6 py-14 text-center">
            <p className="font-heading text-lg font-semibold">
              Services are being prepared
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Our technicians are adding new repair services. Check back shortly.
            </p>
          </div>
        )}
      </section>

      <section className="border-y border-border bg-[#0D0D0B]">
        <div className="container-page py-16 sm:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow">How FixMate works</p>
            <h2 className="section-title mt-2">
              From broken to fixed in four clear steps
            </h2>
            <p className="section-copy mt-3">
              No phone tag, no surprise invoices. A structured pipeline keeps
              customers and technicians on the same page.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative rounded-2xl border border-border bg-card p-6"
              >
                <span className="absolute top-5 right-5 font-heading text-4xl font-extrabold text-border/70">
                  0{index + 1}
                </span>
                <span className="grid size-11 place-items-center rounded-xl bg-primary/12 text-primary">
                  <step.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-heading text-base font-semibold">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Popular categories</p>
            <h2 className="section-title mt-2">What can we fix for you?</h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Seven categories, one standard: verified technicians and upfront
            pricing.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORY_META.map((category) => (
            <Link
              key={category.value}
              href={`/services?category=${encodeURIComponent(category.value)}`}
              className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <category.icon className="size-5" />
              </span>
              <div>
                <p className="font-heading text-sm font-semibold">
                  {category.label}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {category.blurb}
                </p>
              </div>
              <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Explore
                <ArrowRight className="size-3.5" />
              </span>
            </Link>
          ))}

          <Link
            href="/services"
            className="flex flex-col justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/8 p-5 transition-colors hover:bg-primary/12"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Wrench className="size-5" />
            </span>
            <div>
              <p className="font-heading text-sm font-semibold">
                All services
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                See the full catalogue
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
              Browse now
              <ArrowRight className="size-3.5" />
            </span>
          </Link>
        </div>
      </section>

      <section className="border-y border-border bg-[#0D0D0B]">
        <div className="container-page grid gap-12 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-20">
          <div>
            <p className="eyebrow">Why choose FixMate</p>
            <h2 className="section-title mt-2">
              Built around trust, not guesswork
            </h2>
            <p className="section-copy mt-3">
              We removed the parts of repair services people dread: unclear
              pricing, unverified technicians, and paying before you see the
              result.
            </p>

            <div className="mt-8 space-y-4">
              {TRUST_POINTS.map((point) => (
                <div key={point.title} className="flex gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
                    <point.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-heading text-sm font-semibold">
                      {point.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                className="h-10 rounded-full px-5 font-semibold"
                render={<Link href="/sign-up" />}
              >
                Create an account
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="h-10 rounded-full px-5"
                render={<Link href="/services" />}
              >
                Explore services
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <figure
                key={testimonial.name}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                      {testimonial.initials}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <Quote className="size-5 text-primary/40" />
                </div>
                <blockquote className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  “{testimonial.quote}”
                </blockquote>
                <div className="mt-3 flex items-center gap-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="size-3.5 fill-primary" />
                  ))}
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-[#211D12] via-card to-card p-8 sm:p-12">
          <div className="pointer-events-none absolute -top-20 -right-16 size-64 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="eyebrow">Ready when you are</p>
              <h2 className="section-title mt-2">
                Your next repair is a few clicks away
              </h2>
              <p className="section-copy mt-3 max-w-xl">
                Browse verified services, send a request, and track the job from
                start to finish. No upfront payment, ever.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  className="h-11 rounded-full px-6 font-semibold"
                  render={<Link href="/services" />}
                >
                  Find a technician
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-11 rounded-full px-6"
                  render={<Link href="/sign-up" />}
                >
                  Join as a technician
                </Button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {[
                "Admin-approved service listings",
                "Role-based dashboards for every user",
                "Stripe payments after completion",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2.5 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm"
                >
                  <CheckCircle2 className="size-4 shrink-0 text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
