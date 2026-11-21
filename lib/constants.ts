import {
  AirVent,
  BookOpenCheck,
  BriefcaseBusiness,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Laptop,
  ListChecks,
  PlusCircle,
  Refrigerator,
  ShieldCheck,
  Smartphone,
  Tv,
  UserRound,
  Users,
  WashingMachine,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

import type {
  ApprovalStatus,
  BookingStatus,
  Category,
  PaymentStatus,
  Role,
  ServiceMode,
} from "./types";

export const CATEGORY_META: Array<{
  value: Category;
  label: string;
  icon: LucideIcon;
  blurb: string;
}> = [
  {
    value: "Smartphone",
    label: "Smartphone",
    icon: Smartphone,
    blurb: "Screens, batteries & boards",
  },
  {
    value: "Laptop & PC",
    label: "Laptop & PC",
    icon: Laptop,
    blurb: "Diagnostics & tune-ups",
  },
  {
    value: "AC",
    label: "AC",
    icon: AirVent,
    blurb: "Service, gas & repairs",
  },
  {
    value: "Refrigerator",
    label: "Refrigerator",
    icon: Refrigerator,
    blurb: "Cooling & compressor fixes",
  },
  {
    value: "TV",
    label: "TV",
    icon: Tv,
    blurb: "Panels, boards & mounting",
  },
  {
    value: "Washing Machine",
    label: "Washing Machine",
    icon: WashingMachine,
    blurb: "Drums, belts & drainage",
  },
  {
    value: "Electrical",
    label: "Electrical",
    icon: Zap,
    blurb: "Wiring, fans & fixtures",
  },
];

export const CATEGORIES = CATEGORY_META.map((category) => category.value);

export const SERVICE_MODES: ServiceMode[] = ["Home Visit", "Shop Drop-off"];

export const BOOKING_STATUSES: BookingStatus[] = [
  "requested",
  "accepted",
  "in-progress",
  "completed",
  "rejected",
  "cancelled",
];

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  requested: "Requested",
  accepted: "Accepted",
  "in-progress": "In Progress",
  completed: "Completed",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export const BOOKING_STATUS_STYLES: Record<BookingStatus, string> = {
  requested: "border-blue-400/30 bg-blue-400/10 text-blue-300",
  accepted: "border-indigo-400/30 bg-indigo-400/10 text-indigo-300",
  "in-progress": "border-amber-400/30 bg-amber-400/10 text-amber-300",
  completed: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  rejected: "border-red-400/30 bg-red-400/10 text-red-300",
  cancelled: "border-zinc-400/30 bg-zinc-400/10 text-zinc-300",
};

export const APPROVAL_STATUS_LABELS: Record<ApprovalStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export const APPROVAL_STATUS_STYLES: Record<ApprovalStatus, string> = {
  pending: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  approved: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  rejected: "border-red-400/30 bg-red-400/10 text-red-300",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  paid: "Paid",
  unpaid: "Unpaid",
};

export const PAYMENT_STATUS_STYLES: Record<PaymentStatus, string> = {
  paid: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  unpaid: "border-orange-400/30 bg-orange-400/10 text-orange-300",
};

export const ROLE_LABELS: Record<Role, string> = {
  customer: "Customer",
  technician: "Technician",
  admin: "Admin",
};

export const ROLE_STYLES: Record<Role, string> = {
  customer: "border-blue-400/30 bg-blue-400/10 text-blue-300",
  technician: "border-[#C9A227]/40 bg-[#C9A227]/10 text-[#E4C65A]",
  admin: "border-purple-400/30 bg-purple-400/10 text-purple-300",
};

export const ROLE_DASHBOARD: Record<Role, string> = {
  customer: "/dashboard/customer",
  technician: "/dashboard/technician",
  admin: "/dashboard/admin",
};

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const DASHBOARD_NAV: Record<Role, DashboardNavItem[]> = {
  customer: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    {
      label: "My Bookings",
      href: "/dashboard/customer/bookings",
      icon: ClipboardList,
    },
    {
      label: "Payment History",
      href: "/dashboard/customer/payments",
      icon: CreditCard,
    },
    { label: "Update Profile", href: "/dashboard/profile", icon: UserRound },
  ],
  technician: [
    { label: "Overview", href: "/dashboard/technician", icon: LayoutDashboard },
    {
      label: "Add Service",
      href: "/dashboard/technician/add-service",
      icon: PlusCircle,
    },
    {
      label: "My Services",
      href: "/dashboard/technician/my-services",
      icon: Wrench,
    },
    {
      label: "Requests",
      href: "/dashboard/technician/requests",
      icon: ListChecks,
    },
    { label: "Update Profile", href: "/dashboard/profile", icon: UserRound },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    {
      label: "Services",
      href: "/dashboard/admin/services",
      icon: BookOpenCheck,
    },
    {
      label: "Bookings",
      href: "/dashboard/admin/bookings",
      icon: BriefcaseBusiness,
    },
    {
      label: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: CreditCard,
    },
    { label: "Update Profile", href: "/dashboard/profile", icon: UserRound },
  ],
};

export const TRUST_POINTS = [
  {
    title: "Verified technicians",
    description:
      "Every technician is reviewed before their services go live on the marketplace.",
    icon: ShieldCheck,
  },
  {
    title: "Pay after completion",
    description:
      "You only pay once the job is completed and you can see the final amount.",
    icon: CreditCard,
  },
  {
    title: "Track every step",
    description:
      "Requested, accepted, in progress, completed — you always know what is happening.",
    icon: ListChecks,
  },
];
