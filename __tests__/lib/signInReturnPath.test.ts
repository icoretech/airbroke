// @vitest-environment node

import { describe, expect, it } from "vitest";
import { safeRelativeReturnPath } from "@/lib/auth/signInReturnPath";

describe("sign-in return path", () => {
  it.each([
    undefined,
    "",
    "/favicon.ico",
    "/icon.svg",
    "/manifest.webmanifest",
    "/logo.svg",
    "/_next/static/chunk.js",
    "/api/auth/callback/github",
    "/signin",
    "/unknown",
    "/projects/../favicon.ico",
    "/projects/%2e%2e/favicon.ico",
    "//example.com/projects",
    "/\\example.com/projects",
    "https://example.com/projects",
    "javascript:alert(1)",
    "/projects-other",
    "/projects?next=\\example.com",
    "/projects?query=one\ntwo",
    "/projects?query=one\rtwo",
    "/projects?query=one\ttwo",
    "/projects?query=one\u0000two",
  ])("falls back to projects for stale or unsafe return path %s", (value) => {
    expect(safeRelativeReturnPath(value)).toBe("/projects");
  });

  it.each([
    "/",
    "/?query=foo%20bar",
    "/projects",
    "/projects/abc/edit",
    "/projects/foo.bar",
    "/bookmarks",
    "/notices/abc",
    "/occurrences/abc?tab=session&q=foo%20bar&next=https%3A%2F%2Fexample.com",
  ])("preserves the protected page destination %s", (value) => {
    expect(safeRelativeReturnPath(value)).toBe(value);
  });
});
