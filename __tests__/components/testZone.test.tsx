import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import TestZone from "@/components/project/TestZone";
import type { Project } from "@/prisma/generated/client";

const refreshMock = vi.hoisted(() => vi.fn());
const airbrakeNotifyMock = vi.hoisted(() => vi.fn());
const airbrakeNotifierMock = vi.hoisted(() =>
  vi.fn(() => ({ notify: airbrakeNotifyMock })),
);
const sentryCaptureExceptionMock = vi.hoisted(() => vi.fn());
const sentryFlushMock = vi.hoisted(() => vi.fn());
const sentryInitMock = vi.hoisted(() => vi.fn());
const sendAirbrakeNodeExceptionMock = vi.hoisted(() => vi.fn());
const sendSentryNodeExceptionMock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

vi.mock("@airbrake/browser", () => ({
  Notifier: airbrakeNotifierMock,
}));

vi.mock("@sentry/browser", () => ({
  captureException: sentryCaptureExceptionMock,
  flush: sentryFlushMock,
  init: sentryInitMock,
}));

vi.mock("@/lib/actions/airbrakeActions", () => ({
  sendAirbrakeNodeException: sendAirbrakeNodeExceptionMock,
}));

vi.mock("@/lib/actions/sentryActions", () => ({
  sendSentryNodeException: sendSentryNodeExceptionMock,
}));

const project: Project = {
  id: "project-123",
  name: "Sample Project",
  api_key: "project-key",
  organization: "example-org",
  repo_provider: "github",
  repo_provider_api_key: null,
  repo_provider_api_secret: null,
  repo_branch: "main",
  repo_issue_tracker: null,
  repo_url: null,
  notices_count: BigInt(0),
  paused: false,
  created_at: new Date("2025-01-01T00:00:00.000Z"),
  updated_at: new Date("2025-01-01T00:00:00.000Z"),
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("TestZone", () => {
  it("renders all configured test actions", () => {
    render(<TestZone project={project} />);

    expect(screen.getByText("Airbrake: JavaScript")).toBeDefined();
    expect(screen.getByText("Airbrake: Node.js")).toBeDefined();
    expect(screen.getByText("Sentry: Browser")).toBeDefined();
    expect(screen.getByText("Sentry: Node.js")).toBeDefined();
    expect(screen.getAllByRole("button", { name: "Test" })).toHaveLength(4);
  });

  it("uses one pending action while running a test", async () => {
    let resolveAction: (() => void) | undefined;
    sendAirbrakeNodeExceptionMock.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveAction = resolve;
      }),
    );

    render(<TestZone project={project} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Test" })[1]);

    expect(screen.getByRole("button", { name: /Sending/ })).toBeDefined();
    expect(
      screen
        .getAllByRole("button")
        .every((button) => button.hasAttribute("disabled")),
    ).toBe(true);

    expect(sendAirbrakeNodeExceptionMock).toHaveBeenCalledWith(
      project.id,
      project.api_key,
      expect.any(String),
    );

    resolveAction?.();

    await waitFor(() => {
      expect(refreshMock).toHaveBeenCalled();
    });
  });
});
