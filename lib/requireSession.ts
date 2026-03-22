// lib/requireSession.ts

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { Route } from "next";

/**
 * Validates the session server-side. Redirects to /signin if no valid session,
 * preserving the full URL (path + query string) as callbackUrl so the user
 * returns after login. Use in every protected page/layout to enforce
 * authentication beyond the optimistic cookie check in proxy.ts.
 */
export async function requireSession() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });
  if (!session) {
    // Preserve the original URL so the user returns after sign-in.
    // Next.js sets x-invoke-path and x-invoke-query for server components;
    // fall back to referer which includes the full URL.
    const pathname = reqHeaders.get("x-invoke-path");
    const query = reqHeaders.get("x-invoke-query");
    const fullPath =
      buildFullPath(pathname, query) ??
      parseFullPath(reqHeaders.get("referer"));

    if (fullPath && fullPath !== "/") {
      redirect(`/signin?callbackUrl=${encodeURIComponent(fullPath)}` as Route);
    }
    redirect("/signin");
  }
  return session;
}

function buildFullPath(
  pathname: string | null,
  query: string | null,
): string | undefined {
  if (!pathname) return undefined;
  if (!query || query === "{}") return pathname;
  // x-invoke-query is a JSON object like {"tab":"session","q":"foo"}
  try {
    const params = JSON.parse(query) as Record<string, string>;
    const qs = new URLSearchParams(params).toString();
    return qs ? `${pathname}?${qs}` : pathname;
  } catch {
    return pathname;
  }
}

function parseFullPath(url: string | null): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    return parsed.search
      ? `${parsed.pathname}${parsed.search}`
      : parsed.pathname;
  } catch {
    return undefined;
  }
}
