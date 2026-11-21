import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { CATEGORY_META } from "@/lib/constants";

import { CurrentYear } from "./CurrentYear";
import { Logo } from "./Logo";

function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  );
}

const socials = [
  { label: "X", href: "https://x.com", icon: XLogo },
  {
    label: "GitHub",
    href: "https://github.com",
    icon: ({ className }: { className?: string }) => (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <path
          fill="currentColor"
          d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.4-1.27.73-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.35.77 1.05.77 2.12v3.14c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z"
        />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-[#0D0D0B]">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Verified technicians for the devices and appliances you rely on
            every day. Book a repair, track it live, and pay only when the job
            is done.
          </p>
          <div className="flex items-center gap-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <social.icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold tracking-wide">
            Quick links
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {[
              { href: "/", label: "Home" },
              { href: "/services", label: "Browse services" },
              { href: "/about", label: "About FixMate" },
              { href: "/sign-up", label: "Become a technician" },
              { href: "/dashboard", label: "Dashboard" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold tracking-wide">
            Popular categories
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {CATEGORY_META.slice(0, 5).map((category) => (
              <li key={category.value}>
                <Link
                  href={`/services?category=${encodeURIComponent(category.value)}`}
                  className="transition-colors hover:text-primary"
                >
                  {category.label} repair
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold tracking-wide">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              Dhanmondi, Dhaka 1209, Bangladesh
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 shrink-0 text-primary" />
              +880 1711 000 000
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-primary" />
              hello@fixmate.com
            </li>
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground/70">
            Support hours: Sat–Thu, 9:00 AM – 9:00 PM
          </p>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>© <CurrentYear /> FixMate. All rights reserved.</p>
          <p>
            Built for honest repairs — transparent pricing, verified pros, no
            surprises.
          </p>
        </div>
      </div>
    </footer>
  );
}
