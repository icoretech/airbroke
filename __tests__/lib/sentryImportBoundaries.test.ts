import { afterEach, describe, expect, it, vi } from "vitest";

describe("sentry import boundaries", () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock("@sentry/browser");
    vi.doUnmock("@sentry/node");
  });

  it("reads sentry config templates without importing sentry runtimes", async () => {
    vi.doMock("@sentry/browser", () => {
      throw new Error("@sentry/browser should not load for template strings");
    });
    vi.doMock("@sentry/node", () => {
      throw new Error("@sentry/node should not load for template strings");
    });

    const mod = await import("@/lib/integrations/sentryConfigTemplates");

    expect(mod.sentryBrowserTemplate).toContain('from "@sentry/browser"');
    expect(mod.sentryNodeTemplate).toContain('from "@sentry/node"');
  });

  it("loads sentry server actions without importing sentry node", async () => {
    vi.doMock("@sentry/node", () => {
      throw new Error("@sentry/node should not load at module import time");
    });

    const actions = await import("@/lib/actions/sentryActions");

    expect(actions.sendSentryNodeException).toBeTypeOf("function");
  });
});
