// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({ db: {} }));

const {
  envList,
  decodeJwtPayload,
  assertEmailDomain,
  enforceEmailDomainForProvider,
  fetchWithTimeout,
} = await import("@/lib/auth");

// ---------------------------------------------------------------------------
// envList
// ---------------------------------------------------------------------------
describe("envList", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });
  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns undefined when env var is not set", () => {
    delete process.env.TEST_LIST;
    expect(envList("TEST_LIST")).toBeUndefined();
  });

  it("returns undefined when env var is empty", () => {
    process.env.TEST_LIST = "";
    expect(envList("TEST_LIST")).toBeUndefined();
  });

  it("splits comma-separated values", () => {
    process.env.TEST_LIST = "a,b,c";
    expect(envList("TEST_LIST")).toEqual(["a", "b", "c"]);
  });

  it("trims whitespace", () => {
    process.env.TEST_LIST = " a , b , c ";
    expect(envList("TEST_LIST")).toEqual(["a", "b", "c"]);
  });

  it("filters empty entries", () => {
    process.env.TEST_LIST = "a,,b,";
    expect(envList("TEST_LIST")).toEqual(["a", "b"]);
  });

  it("returns single-element array for single value", () => {
    process.env.TEST_LIST = "only";
    expect(envList("TEST_LIST")).toEqual(["only"]);
  });
});

// ---------------------------------------------------------------------------
// decodeJwtPayload
// ---------------------------------------------------------------------------
describe("decodeJwtPayload", () => {
  it("decodes a valid JWT payload", () => {
    const payload = { tid: "tenant-123", sub: "user-1" };
    const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const token = `header.${encoded}.signature`;
    expect(decodeJwtPayload(token)).toEqual(payload);
  });

  it("returns empty object for malformed token (no dots)", () => {
    expect(decodeJwtPayload("not-a-jwt")).toEqual({});
  });

  it("returns empty object for token with only 2 parts", () => {
    expect(decodeJwtPayload("header.payload")).toEqual({});
  });

  it("returns empty object for invalid base64 payload", () => {
    expect(decodeJwtPayload("a.!!!.b")).toEqual({});
  });

  it("returns empty object for empty string", () => {
    expect(decodeJwtPayload("")).toEqual({});
  });

  it("handles payload with special characters", () => {
    const payload = { name: "José García", emoji: "hello" };
    const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
    expect(decodeJwtPayload(`h.${encoded}.s`)).toEqual(payload);
  });
});

// ---------------------------------------------------------------------------
// assertEmailDomain
// ---------------------------------------------------------------------------
describe("assertEmailDomain", () => {
  it("passes for verified email with allowed domain", () => {
    expect(() =>
      assertEmailDomain("user@example.com", true, ["example.com"], "test"),
    ).not.toThrow();
  });

  it("rejects unverified email even with allowed domain", () => {
    expect(() =>
      assertEmailDomain("user@example.com", false, ["example.com"], "test"),
    ).toThrow("email not verified");
  });

  it("rejects undefined emailVerified", () => {
    expect(() =>
      assertEmailDomain("user@example.com", undefined, ["example.com"], "test"),
    ).toThrow("email not verified");
  });

  it("rejects verified email with disallowed domain", () => {
    expect(() =>
      assertEmailDomain("user@evil.com", true, ["example.com"], "test"),
    ).toThrow("email domain not allowed");
  });

  it("rejects undefined email", () => {
    expect(() =>
      assertEmailDomain(undefined, true, ["example.com"], "test"),
    ).toThrow("email domain not allowed");
  });

  it("rejects email without @ sign", () => {
    expect(() =>
      assertEmailDomain("nodomain", true, ["example.com"], "test"),
    ).toThrow("email domain not allowed");
  });

  it("allows multiple domains", () => {
    expect(() =>
      assertEmailDomain(
        "user@corp.com",
        true,
        ["example.com", "corp.com"],
        "test",
      ),
    ).not.toThrow();
  });

  it("includes provider label in error message", () => {
    expect(() =>
      assertEmailDomain("user@bad.com", true, ["good.com"], "google"),
    ).toThrow("google: email domain not allowed");
  });
});

// ---------------------------------------------------------------------------
// enforceEmailDomainForProvider
// ---------------------------------------------------------------------------
describe("enforceEmailDomainForProvider", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });
  afterEach(() => {
    process.env = originalEnv;
  });

  it("does nothing for providers without domain env var mapping", () => {
    expect(() =>
      enforceEmailDomainForProvider("user@test.com", true, "github"),
    ).not.toThrow();
  });

  it("does nothing when domain env var is not set", () => {
    delete process.env.AIRBROKE_GOOGLE_DOMAINS;
    expect(() =>
      enforceEmailDomainForProvider("user@test.com", true, "google"),
    ).not.toThrow();
  });

  it("passes for google provider with allowed domain", () => {
    process.env.AIRBROKE_GOOGLE_DOMAINS = "example.com";
    expect(() =>
      enforceEmailDomainForProvider("user@example.com", true, "google"),
    ).not.toThrow();
  });

  it("rejects for google provider with disallowed domain", () => {
    process.env.AIRBROKE_GOOGLE_DOMAINS = "example.com";
    expect(() =>
      enforceEmailDomainForProvider("user@evil.com", true, "google"),
    ).toThrow("email domain not allowed");
  });

  it("rejects for google provider with unverified email", () => {
    process.env.AIRBROKE_GOOGLE_DOMAINS = "example.com";
    expect(() =>
      enforceEmailDomainForProvider("user@example.com", false, "google"),
    ).toThrow("email not verified");
  });

  it("works for auth0 provider", () => {
    process.env.AIRBROKE_AUTH0_DOMAINS = "corp.com";
    expect(() =>
      enforceEmailDomainForProvider("user@corp.com", true, "auth0"),
    ).not.toThrow();
  });

  it("works for boxyhq-saml provider", () => {
    process.env.AIRBROKE_BOXYHQ_SAML_DOMAINS = "saml.com";
    expect(() =>
      enforceEmailDomainForProvider("user@saml.com", true, "boxyhq-saml"),
    ).not.toThrow();
  });

  it("works for fusionauth provider", () => {
    process.env.AIRBROKE_FUSIONAUTH_DOMAINS = "fusion.com";
    expect(() =>
      enforceEmailDomainForProvider("user@other.com", true, "fusionauth"),
    ).toThrow("email domain not allowed");
  });
});

// ---------------------------------------------------------------------------
// fetchWithTimeout
// ---------------------------------------------------------------------------
describe("fetchWithTimeout", () => {
  it("returns response on success", async () => {
    const mockResponse = new Response("ok", { status: 200 });
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(mockResponse);

    const res = await fetchWithTimeout("https://example.com", {});
    expect(res.status).toBe(200);

    vi.restoreAllMocks();
  });

  it("aborts on timeout", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementationOnce(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          (init?.signal as AbortSignal)?.addEventListener("abort", () =>
            reject(new DOMException("aborted", "AbortError")),
          );
        }),
    );

    await expect(fetchWithTimeout("https://example.com", {})).rejects.toThrow();

    vi.restoreAllMocks();
  });
});

// ---------------------------------------------------------------------------
// callbackUrl sanitization (same logic as SignInPageClient)
// ---------------------------------------------------------------------------
describe("callbackUrl sanitization", () => {
  function sanitize(raw: string): string {
    return raw.startsWith("/") && !raw.startsWith("//") ? raw : "/projects";
  }

  it("allows relative paths", () => {
    expect(sanitize("/projects")).toBe("/projects");
    expect(sanitize("/occurrences/abc")).toBe("/occurrences/abc");
  });

  it("rejects absolute URLs (open redirect)", () => {
    expect(sanitize("https://evil.com")).toBe("/projects");
  });

  it("rejects protocol-relative URLs", () => {
    expect(sanitize("//evil.com")).toBe("/projects");
  });

  it("rejects empty string", () => {
    expect(sanitize("")).toBe("/projects");
  });

  it("rejects javascript: URLs", () => {
    expect(sanitize("javascript:alert(1)")).toBe("/projects");
  });
});
