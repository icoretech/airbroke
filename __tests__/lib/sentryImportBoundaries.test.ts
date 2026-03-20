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

    const mod = await import("@/lib/sentryConfigTemplates");

    expect(mod.sentryBrowserTemplate).toContain('from "@sentry/browser"');
    expect(mod.sentryNodeTemplate).toContain('from "@sentry/node"');
  });

  it("loads common server actions without importing sentry node", async () => {
    vi.doMock("@/lib/actions/airbrakeActions", () => ({
      sendAirbrakeNodeException: vi.fn(),
    }));
    vi.doMock("@/lib/actions/occurrenceActions", () => ({
      bookmarkOccurrence: vi.fn(),
      deleteOccurrence: vi.fn(),
      performReplay: vi.fn(),
      reinstateOccurrence: vi.fn(),
      resolveOccurrence: vi.fn(),
    }));
    vi.doMock("@/lib/actions/projectActions", () => ({
      createProject: vi.fn(),
      deleteProject: vi.fn(),
      deleteProjectNotices: vi.fn(),
      toggleProjectPausedStatus: vi.fn(),
      updateProject: vi.fn(),
    }));
    vi.doMock("@sentry/node", () => {
      throw new Error("@sentry/node should not load for common server actions");
    });

    const actions = await import("@/app/_actions");

    expect(actions.toggleProjectPausedStatus).toBeTypeOf("function");
    expect(actions.sendSentryNodeException).toBeTypeOf("function");
  });
});
