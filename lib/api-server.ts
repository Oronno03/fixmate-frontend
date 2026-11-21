import "server-only";

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

/**
 * Fetches public data from the Express API on the server. Use this for pages
 * that do not depend on the current session.
 */
export async function serverFetch<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      cache: "no-store",
    });

    if (!response.ok) return null;

    const json = (await response.json()) as { data?: T };
    return json.data ?? (json as T);
  } catch {
    return null;
  }
}
