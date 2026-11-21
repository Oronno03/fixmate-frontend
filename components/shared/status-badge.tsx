import { Badge } from "@/components/ui/badge";
import {
  APPROVAL_STATUS_LABELS,
  APPROVAL_STATUS_STYLES,
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_STYLES,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_STYLES,
  ROLE_LABELS,
  ROLE_STYLES,
} from "@/lib/constants";
import type {
  ApprovalStatus,
  BookingStatus,
  PaymentStatus,
  Role,
} from "@/lib/types";
import { cn } from "@/lib/utils";

export function BookingStatusBadge({
  status,
  className,
}: {
  status: BookingStatus;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(BOOKING_STATUS_STYLES[status], className)}
    >
      {BOOKING_STATUS_LABELS[status]}
    </Badge>
  );
}

export function PaymentStatusBadge({
  status,
  className,
}: {
  status: PaymentStatus;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(PAYMENT_STATUS_STYLES[status], className)}
    >
      {PAYMENT_STATUS_LABELS[status]}
    </Badge>
  );
}

export function ApprovalStatusBadge({
  status,
  className,
}: {
  status: ApprovalStatus;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(APPROVAL_STATUS_STYLES[status], className)}
    >
      {APPROVAL_STATUS_LABELS[status]}
    </Badge>
  );
}

export function RoleBadge({
  role,
  className,
}: {
  role: Role;
  className?: string;
}) {
  return (
    <Badge variant="outline" className={cn(ROLE_STYLES[role], className)}>
      {ROLE_LABELS[role]}
    </Badge>
  );
}
