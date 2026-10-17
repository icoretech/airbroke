// @vitest-environment node

import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { SIGN_IN_RETURN_PATH_COOKIE_NAME } from "@/lib/auth/signInReturnPath";
import { config, proxy } from "../proxy";

function makeRequest(
  pathname: string,
  search = "",
  sessionToken?: string,
): Parameters<typeof proxy>[0] {
  const url = new URL(`${pathname}${search}`, "https://airbroke.example.com");
  return new NextRequest(url, {
    headers: sessionToken
      ? { cookie: `better-auth.session_token=${sessionToken}` }
      : undefined,
  });
}

describe("proxy route protection", () => {
  it("allows / without a session", () => {
    const res = proxy(makeRequest("/"));
    expect(res.headers.get("location")).toBeNull();
  });

  it("allows /signin without a session", () => {
    const res = proxy(makeRequest("/signin"));
    expect(res.headers.get("location")).toBeNull();
  });

  it("redirects /projects to /signin with a return path cookie when no session", () => {
    const res = proxy(makeRequest("/projects"));
    expect(res.status).toBe(307);
    const location = new URL(res.headers.get("location") ?? "");
    expect(location.pathname).toBe("/signin");
    expect(location.searchParams.get("callbackUrl")).toBeNull();
    expect(res.headers.get("set-cookie")).toContain(
      `${SIGN_IN_RETURN_PATH_COOKIE_NAME}=%2Fprojects`,
    );
  });

  it("redirects /bookmarks to /signin with a return path cookie when no session", () => {
    const res = proxy(makeRequest("/bookmarks"));
    expect(res.status).toBe(307);
    const location = new URL(res.headers.get("location") ?? "");
    expect(location.pathname).toBe("/signin");
    expect(location.searchParams.get("callbackUrl")).toBeNull();
    expect(res.headers.get("set-cookie")).toContain(
      `${SIGN_IN_RETURN_PATH_COOKIE_NAME}=%2Fbookmarks`,
    );
  });

  it("preserves deep link path in the return path cookie when no session", () => {
    const res = proxy(makeRequest("/occurrences/abc123/page"));
    expect(res.status).toBe(307);
    const location = new URL(res.headers.get("location") ?? "");
    expect(location.pathname).toBe("/signin");
    expect(res.headers.get("set-cookie")).toContain(
      `${SIGN_IN_RETURN_PATH_COOKIE_NAME}=%2Foccurrences%2Fabc123%2Fpage`,
    );
  });

  it("allows /projects with a valid session cookie", () => {
    const res = proxy(makeRequest("/projects", "", "session_token_value"));
    expect(res.headers.get("location")).toBeNull();
  });

  it("allows nested paths with a valid session cookie", () => {
    const res = proxy(
      makeRequest("/occurrences/abc123", "", "session_token_value"),
    );
    expect(res.headers.get("location")).toBeNull();
  });

  it("preserves query string in the return path cookie", () => {
    const res = proxy(makeRequest("/occurrences/abc", "?tab=session&q=foo"));
    expect(res.status).toBe(307);
    expect(res.headers.get("set-cookie")).toContain(
      `${SIGN_IN_RETURN_PATH_COOKIE_NAME}=%2Foccurrences%2Fabc%3Ftab%3Dsession%26q%3Dfoo`,
    );
  });

  it.each([
    "/favicon.ico",
    "/icon.svg",
    "/manifest.webmanifest",
    "/logo.svg",
    "/screenshot.png",
    "/_next/static/chunk.js",
    "/robots.txt",
    "/sitemap.xml",
    "/api/auth/callback/github",
    "/notifier_api/v2/notices",
    "/unknown",
  ])("does not intercept the non-page request %s", (pathname) => {
    // Given the real Next matcher and an unauthenticated resource request.
    const request = makeRequest(pathname);

    // When Next evaluates the proxy configuration and the guard is called directly.
    const matched = unstable_doesMiddlewareMatch({ config, url: request.url });
    const response = proxy(request);

    // Then neither routing nor cookie state is changed.
    expect(matched).toBe(false);
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it.each([
    "/signin",
    "/projects",
    "/projects/abc/edit",
    "/bookmarks",
    "/notices/abc",
    "/occurrences/abc?tab=session&q=foo",
  ])("matches the protected page or sign-in route %s", (url) => {
    expect(unstable_doesMiddlewareMatch({ config, url })).toBe(true);
  });

  it("preserves a saved occurrence destination when the browser requests favicon after a denied callback", () => {
    // Given a saved deep link with its query and no authenticated session.
    const initial = proxy(
      makeRequest("/occurrences/abc", "?tab=session&q=foo"),
    );
    const saved = initial.cookies.get(SIGN_IN_RETURN_PATH_COOKIE_NAME);
    expect(saved?.value).toBe("/occurrences/abc?tab=session&q=foo");
    const request = new NextRequest("https://example.com/favicon.ico", {
      headers: {
        cookie: `${SIGN_IN_RETURN_PATH_COOKIE_NAME}=${encodeURIComponent(saved?.value ?? "")}`,
      },
    });

    // When the favicon fetch follows an OAuth failure.
    const response = proxy(request);

    // Then the automatic resource fetch cannot replace the user's destination.
    expect(unstable_doesMiddlewareMatch({ config, url: request.url })).toBe(
      false,
    );
    expect(response.headers.get("location")).toBeNull();
    expect(
      response.cookies.get(SIGN_IN_RETURN_PATH_COOKIE_NAME),
    ).toBeUndefined();
  });
});
