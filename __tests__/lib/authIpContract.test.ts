// @vitest-environment node

import { execFileSync } from "node:child_process";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { BetterAuthOptions } from "better-auth";

// Better Auth captures NODE_ENV when its native ESM module is first imported.
// A separate production process exercises rejected headers without test fallback.
function resolveProductionIP(
  headers: Record<string, string>,
  options: BetterAuthOptions,
) {
  return execFileSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `
    import { getIP } from "better-auth/api";
    const [headers, advanced] = JSON.parse(process.argv[1]);
    process.stdout.write(JSON.stringify(getIP(new Headers(headers), { advanced })));
  `,
      JSON.stringify([headers, options.advanced]),
    ],
    {
      env: { ...process.env, NODE_ENV: "production", TEST: "" },
      encoding: "utf8",
    },
  );
}

describe("Better Auth trusted client IP configuration", () => {
  beforeEach(() => {
    vi.resetModules();
    for (const key of Object.keys(process.env)) {
      if (key.startsWith("AIRBROKE_")) vi.stubEnv(key, "");
    }
  });

  afterEach(() => vi.unstubAllEnvs());

  it("preserves the library default when trusted headers are not configured", async () => {
    // Given no explicitly trusted deployment header.
    const { getAuth } = await import("@/lib/auth");
    const options: BetterAuthOptions = getAuth().options;

    // When a single forwarded client address arrives.
    const address = resolveProductionIP(
      { "x-forwarded-for": "192.0.2.10" },
      options,
    );

    // Then Better Auth's safe default still resolves it.
    expect(options.advanced?.ipAddress?.ipAddressHeaders).toBeUndefined();
    expect(address).toBe('"192.0.2.10"');
  });

  it("uses only the configured edge header when other forwarded headers conflict", async () => {
    // Given an operator-configured header overwritten by their trusted edge.
    vi.stubEnv("AIRBROKE_AUTH_IP_HEADERS", " x-real-ip ");
    const { getAuth } = await import("@/lib/auth");
    const options: BetterAuthOptions = getAuth().options;

    // When an unrelated forwarded header claims another address.
    const address = resolveProductionIP(
      {
        "x-real-ip": "192.0.2.10",
        "x-forwarded-for": "198.51.100.20",
      },
      options,
    );

    // Then only the explicitly configured single address determines identity.
    expect(address).toBe('"192.0.2.10"');
    expect(options.advanced?.ipAddress?.trustedProxies).toBeUndefined();
    expect(
      resolveProductionIP(
        { "x-real-ip": "192.0.2.10, 198.51.100.20" },
        options,
      ),
    ).toBe("null");
    expect(
      resolveProductionIP({ "x-forwarded-for": "198.51.100.20" }, options),
    ).toBe("null");
  });
});
