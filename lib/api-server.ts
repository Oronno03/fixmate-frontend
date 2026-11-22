import "server-only";

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

/**
 * Fetches public data from the Express API on the server. Use this for pages
 * that do not depend on the current session.
 */
export async function serverFetch<T>(path: string): Promise<T | null> {
  const json = await serverFetchEnvelope<{ data?: T }>(path);
  if (!json) return null;
  return (json.data ?? json) as T;
}

/**
 * Returns the complete JSON envelope. Use this when a response includes
 * metadata alongside `data`, such as pagination details.
 */
export async function serverFetchEnvelope<T>(
  path: string,
): Promise<T | null> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      cache: "no-store",
    });

    if (!response.ok) return null;

    return (await response.json()) as T;
  } catch {
    return null;
  }
}
