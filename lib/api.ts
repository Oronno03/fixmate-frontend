"use client";

import type { ApiErrorBody } from "./types";

export const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

let cachedToken: { value: string; expiresAt: number } | null = null;

export class ApiError extends Error {
  status: number;
  issues?: ApiErrorBody["issues"];

  constructor(
    message: string,
    status: number,
    issues?: ApiErrorBody["issues"],
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.issues = issues;
  }
}

async function getToken(force = false) {
  if (!force && cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  const response = await fetch("/api/auth/token", {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    cachedToken = null;
    throw new ApiError("Your session expired. Please sign in again.", 401);
  }

  const json = (await response.json()) as { token?: string };
  if (!json.token) {
    cachedToken = null;
    throw new ApiError("Could not create an access token.", 401);
  }

  cachedToken = {
    value: json.token,
    // BetterAuth JWTs default to 15 minutes. Refresh a little early.
    expiresAt: Date.now() + 10 * 60 * 1000,
  };

  return cachedToken.value;
}

export function clearApiTokenCache() {
  cachedToken = null;
}

interface ApiFetchOptions extends RequestInit {
  auth?: boolean;
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { auth = true, ...init } = options;

  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (auth) {
    headers.set("Authorization", `Bearer ${await getToken()}`);
  }

  let response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (response.status === 401 && auth) {
    headers.set("Authorization", `Bearer ${await getToken(true)}`);
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
      cache: "no-store",
    });
  }

  const json = (await response.json().catch(() => null)) as
    | (ApiErrorBody & { data?: T })
    | null;

  if (!response.ok) {
    throw new ApiError(
      json?.message || "The request failed. Please try again.",
      response.status,
      json?.issues,
    );
  }

  return (json?.data ?? json) as T;
}
