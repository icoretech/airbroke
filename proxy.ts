// proxy.ts — Next.js 16 proxy (replaces middleware.ts)
// https://better-auth.com/docs/integrations/next

import { getSessionCookie } from "better-auth/cookies";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = new Set(["/"]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  // Redirect authenticated users away from /signin → /projects
  if (pathname === "/signin") {
    if (sessionCookie) {
      return NextResponse.redirect(new URL("/projects", request.url));
    }
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  // Optimistic cookie-presence check only. Full session validation happens
  // server-side via requireSession() in AppShell and protected pages.
  // All protected pages/layouts MUST call requireSession() or
  // getAuth().api.getSession() for actual session validation.
  if (!sessionCookie) {
    const signInUrl = new URL("/signin", request.url);
    const { search } = request.nextUrl;
    const fullPath = search ? `${pathname}${search}` : pathname;
    signInUrl.searchParams.set("callbackUrl", fullPath);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/|notifier_api|_vercel|icon|robots.txt|sitemap.xml).+)",
  ],
};
