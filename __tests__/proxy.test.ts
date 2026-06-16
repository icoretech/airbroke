// @vitest-environment node

import { describe, expect, it, vi } from "vitest";
import { SIGN_IN_RETURN_PATH_COOKIE_NAME } from "@/lib/auth/signInReturnPath";

const getSessionCookieMock = vi.hoisted(() => vi.fn());

vi.mock("better-auth/cookies", () => ({
  getSessionCookie: getSessionCookieMock,
}));

import { config, proxy } from "../proxy";

function makeRequest(
  pathname: string,
  search = "",
): Parameters<typeof proxy>[0] {
  const url = new URL(`${pathname}${search}`, "https://airbroke.example.com");
  return { nextUrl: url, url: url.toString() } as unknown as Parameters<
    typeof proxy
  >[0];
}

describe("proxy route protection", () => {
  it("allows / without a session", () => {
    getSessionCookieMock.mockReturnValue(undefined);
    const res = proxy(makeRequest("/"));
    expect(res.headers.get("location")).toBeNull();
  });

  it("allows /signin without a session", () => {
    getSessionCookieMock.mockReturnValue(undefined);
    const res = proxy(makeRequest("/signin"));
    expect(res.headers.get("location")).toBeNull();
  });

  it("redirects /projects to /signin with a return path cookie when no session", () => {
    getSessionCookieMock.mockReturnValue(undefined);
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
    getSessionCookieMock.mockReturnValue(undefined);
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
    getSessionCookieMock.mockReturnValue(undefined);
    const res = proxy(makeRequest("/occurrences/abc123/page"));
    expect(res.status).toBe(307);
    const location = new URL(res.headers.get("location") ?? "");
    expect(location.pathname).toBe("/signin");
    expect(res.headers.get("set-cookie")).toContain(
      `${SIGN_IN_RETURN_PATH_COOKIE_NAME}=%2Foccurrences%2Fabc123%2Fpage`,
    );
  });

  it("allows /projects with a valid session cookie", () => {
    getSessionCookieMock.mockReturnValue("session_token_value");
    const res = proxy(makeRequest("/projects"));
    expect(res.headers.get("location")).toBeNull();
  });

  it("allows nested paths with a valid session cookie", () => {
    getSessionCookieMock.mockReturnValue("session_token_value");
    const res = proxy(makeRequest("/occurrences/abc123"));
    expect(res.headers.get("location")).toBeNull();
  });

  it("preserves query string in the return path cookie", () => {
    getSessionCookieMock.mockReturnValue(undefined);
    const res = proxy(makeRequest("/occurrences/abc", "?tab=session&q=foo"));
    expect(res.status).toBe(307);
    expect(res.headers.get("set-cookie")).toContain(
      `${SIGN_IN_RETURN_PATH_COOKIE_NAME}=%2Foccurrences%2Fabc%3Ftab%3Dsession%26q%3Dfoo`,
    );
  });

  it("exports a matcher config that excludes api and static paths", () => {
    expect(config.matcher).toBeDefined();
    expect(config.matcher[0]).toContain("api");
    expect(config.matcher[0]).toContain("_next");
    expect(config.matcher[0]).toContain("robots.txt");
  });
});
