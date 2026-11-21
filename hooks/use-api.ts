"use client";

import useSWR from "swr";

import { apiFetch } from "@/lib/api";

export function useApi<T>(path: string | null) {
  return useSWR<T>(path, (key: string) => apiFetch<T>(key), {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });
}
