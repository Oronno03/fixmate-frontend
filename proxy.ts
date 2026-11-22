import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";
  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/payment");

  if (isProtected && !sessionCookie) {
    const url = new URL("/sign-in", request.url);
    // Keep filters and page numbers so the user lands on the same view after
    // signing in.
    url.searchParams.set("redirect", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && sessionCookie) {
    const requested = request.nextUrl.searchParams.get("redirect");
    const destination =
      requested && requested.startsWith("/") && !requested.startsWith("//")
        ? requested
        : "/dashboard";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/payment/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
