// @vitest-environment node

import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Project } from "@/prisma/generated/client";

type IntegrationsGridProps = {
  readonly replacements: Readonly<Record<string, string>>;
};

const headersMock = vi.hoisted(() => vi.fn());
const integrationsGridMock = vi.hoisted(() =>
  vi.fn((_props: IntegrationsGridProps) => null),
);
const getNoticesCountByProjectIdMock = vi.hoisted(() => vi.fn());
const getLastNoticeDateByProjectIdMock = vi.hoisted(() => vi.fn());
const getOccurrencesCountByProjectIdMock = vi.hoisted(() => vi.fn());
const getHourlyOccurrenceRateForLast14DaysMock = vi.hoisted(() => vi.fn());

vi.mock("next/headers", () => ({ headers: headersMock }));
vi.mock("@/components/analytics/ActivityCard", () => ({ default: () => null }));
vi.mock("@/components/analytics/HealthCard", () => ({ default: () => null }));
vi.mock("@/components/common/CopyToClipboardButton", () => ({
  default: () => null,
}));
vi.mock("@/components/common/SourceRepoProviderIcon", () => ({
  SourceRepoProviderIcon: () => null,
}));
vi.mock("@/components/project/IntegrationsGrid", () => ({
  default: integrationsGridMock,
}));
vi.mock("@/components/project/TestZone", () => ({ default: () => null }));
vi.mock("@/components/project/cards/DangerZone", () => ({
  default: () => null,
}));
vi.mock("@/components/ui/button", () => ({ buttonVariants: () => "" }));
vi.mock("@/components/ui/card", () => ({
  Card: "div",
  CardContent: "div",
  CardDescription: "div",
  CardHeader: "div",
  CardTitle: "div",
}));
vi.mock("@/components/ui/empty", () => ({
  Empty: "div",
  EmptyContent: "div",
  EmptyDescription: "div",
  EmptyMedia: "div",
  EmptyTitle: "div",
}));
vi.mock("@/components/ui/item", () => ({
  Item: "div",
  ItemContent: "div",
  ItemDescription: "div",
  ItemGroup: "div",
  ItemMedia: "div",
  ItemSeparator: "hr",
  ItemTitle: "div",
}));
vi.mock("@/components/ui/separator", () => ({ Separator: "hr" }));
vi.mock("@/lib/queries/notices", () => ({
  getLastNoticeDateByProjectId: getLastNoticeDateByProjectIdMock,
  getNoticesCountByProjectId: getNoticesCountByProjectIdMock,
}));
vi.mock("@/lib/queries/occurrences", () => ({
  getHourlyOccurrenceRateForLast14Days:
    getHourlyOccurrenceRateForLast14DaysMock,
  getOccurrencesCountByProjectId: getOccurrencesCountByProjectIdMock,
}));

const project: Project = {
  id: "project-1",
  name: "Sample project",
  api_key: "project-key",
  organization: "sample-org",
  repo_provider: "github",
  repo_provider_api_key: null,
  repo_provider_api_secret: null,
  repo_branch: "main",
  repo_issue_tracker: null,
  repo_url: null,
  notices_count: BigInt(0),
  paused: false,
  created_at: new Date("2026-01-01T00:00:00.000Z"),
  updated_at: new Date("2026-01-01T00:00:00.000Z"),
};

const originalBetterAuthUrl = process.env.BETTER_AUTH_URL;

describe("project Overview", () => {
  beforeEach(() => {
    integrationsGridMock.mockClear();
    getNoticesCountByProjectIdMock.mockResolvedValue(0);
    getLastNoticeDateByProjectIdMock.mockResolvedValue(null);
    getOccurrencesCountByProjectIdMock.mockResolvedValue(0);
    getHourlyOccurrenceRateForLast14DaysMock.mockResolvedValue(0);
  });

  afterEach(() => {
    if (originalBetterAuthUrl === undefined) {
      delete process.env.BETTER_AUTH_URL;
    } else {
      process.env.BETTER_AUTH_URL = originalBetterAuthUrl;
    }
  });

  it("uses forwarded request headers when the configured auth URL is malformed", async () => {
    process.env.BETTER_AUTH_URL = "not a valid URL";
    headersMock.mockResolvedValue(
      new Headers({
        "x-forwarded-host": "errors.example.com",
        "x-forwarded-proto": "https",
      }),
    );
    const { default: Overview } = await import("@/components/project/Overview");

    const element = await Overview({ project });
    renderToStaticMarkup(element);

    expect(integrationsGridMock).toHaveBeenCalledOnce();
    expect(integrationsGridMock.mock.calls[0]?.[0].replacements).toMatchObject({
      REPLACE_AIRBROKE_HOST: "errors.example.com",
      REPLACE_AIRBROKE_URL: "https://errors.example.com",
    });
  });
});
