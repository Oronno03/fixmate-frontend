"use client";

import { apiFetchBlob } from "./api";

export async function downloadInvoice({
  bookingId,
  paymentId,
}: {
  bookingId?: string;
  paymentId?: string;
}) {
  const path = paymentId
    ? `/api/payments/${paymentId}/invoice`
    : `/api/payments/booking/${bookingId}/invoice`;

  const blob = await apiFetchBlob(path);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `fixmate-invoice-${(paymentId ?? bookingId ?? "receipt")
    .slice(-8)
    .toUpperCase()}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
