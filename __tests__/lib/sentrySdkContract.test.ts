import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { startCaptureServer } from "@/__tests__/helpers/captureServer";

vi.mock("@/lib/db", () => ({
  db: {
    project: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("@/lib/processError", () => ({
  processError: vi.fn(),
}));

const { db } = await import("@/lib/db");
const { processError } = await import("@/lib/processError");
const { POST } = await import("@/app/api/sentry/[project_id]/envelope/route");

describe("Sentry SDK → Airbroke intake contract", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("accepts envelope produced by @sentry/node (tunnel)", async () => {
    const projectId = "p1";
    const projectKey = "k1";

    const { baseUrl, requests, close } = await startCaptureServer({
      responseStatus: 200,
      responseHeaders: {},
      responseBody: "",
    });

    const SentryNode = await import("@sentry/node");

    SentryNode.init({
      dsn: `https://${projectKey}@example.ingest.sentry.io/1`,
      environment: "test-env",
      release: "airbroke-test@1.0.0",
      tunnel: `${baseUrl}/api/sentry/${projectId}/envelope?sentry_key=${projectKey}`,
      tracesSampleRate: 0,
      sampleRate: 1,
      sendClientReports: false,
      defaultIntegrations: false,
      integrations: [],
    });

    const eventId = SentryNode.captureException(new Error("boom"));
    await SentryNode.flush(2000);
    await SentryNode.close(0);

    await close();

    expect(eventId).toBeDefined();
    expect(requests.length).toBeGreaterThanOrEqual(1);

    const captured = requests.find(({ bodyText }) =>
      bodyText.includes('"type":"event"'),
    );
    if (!captured) {
      throw new Error("No Sentry event envelope captured from @sentry/node");
    }

    expect(captured.method).toBe("POST");
    expect(captured.url).toBe(
      `/api/sentry/${projectId}/envelope?sentry_key=${projectKey}`,
    );
    expect(captured.bodyText).toContain('"type":"event"');

    vi.mocked(db.project.findFirst).mockResolvedValue({
      id: projectId,
      api_key: projectKey,
      paused: false,
    } as unknown as Awaited<ReturnType<typeof db.project.findFirst>>);

    const sentryAuthHeader =
      headerValue(captured.headers["x-sentry-auth"]) ??
      `Sentry sentry_key=${projectKey}, sentry_version=7`;
    const contentEncoding = headerValue(captured.headers["content-encoding"]);
    const contentType =
      headerValue(captured.headers["content-type"]) ??
      "application/x-sentry-envelope";
    const headers: Record<string, string> = {
      "content-type": contentType,
      "x-sentry-auth": sentryAuthHeader,
    };
    if (contentEncoding) {
      headers["content-encoding"] = contentEncoding;
    }

    const req = new NextRequest(
      new URL(`http://localhost/api/sentry/${projectId}/envelope`),
      {
        method: "POST",
        body: bodyToArrayBuffer(captured.bodyRaw),
        headers,
      },
    );

    const res = await POST(req, {
      params: Promise.resolve({ project_id: projectId }),
    });
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.id).toBe(eventId);
    expect(processError).toHaveBeenCalledTimes(1);
  });

  it("accepts envelope produced by @sentry/browser (tunnel)", async () => {
    const projectId = "p1";
    const projectKey = "k1";

    const { baseUrl, requests, close } = await startCaptureServer({
      responseStatus: 200,
      responseHeaders: {},
      responseBody: "",
    });

    const tunnel = `${baseUrl}/api/sentry/${projectId}/envelope?sentry_key=${projectKey}`;

    const SentryBrowser = await import("@sentry/browser");
    SentryBrowser.init({
      dsn: "https://public@example.ingest.sentry.io/1",
      tunnel,
      environment: "test-env",
      release: "airbroke-test@1.0.0",
      tracesSampleRate: 0,
      sampleRate: 1,
      sendClientReports: false,
      defaultIntegrations: false,
      integrations: [],
    });

    SentryBrowser.captureException(new Error("boom"));
    await SentryBrowser.flush(5000);
    await SentryBrowser.close(0);

    await close();

    expect(requests.length).toBeGreaterThanOrEqual(1);
    const [captured] = requests;
    expect(captured?.method).toBe("POST");
    expect(captured?.url).toBe(
      `/api/sentry/${projectId}/envelope?sentry_key=${projectKey}`,
    );
    expect(captured?.bodyText).toContain('"type":"event"');

    vi.mocked(db.project.findFirst).mockResolvedValue({
      id: projectId,
      api_key: projectKey,
      paused: false,
    } as unknown as Awaited<ReturnType<typeof db.project.findFirst>>);

    const sentryAuthHeader =
      headerValue(captured.headers["x-sentry-auth"]) ??
      `Sentry sentry_key=${projectKey}, sentry_version=7`;
    const contentEncoding = headerValue(captured.headers["content-encoding"]);
    const contentType =
      headerValue(captured.headers["content-type"]) ??
      "application/x-sentry-envelope";
    const headers: Record<string, string> = {
      "content-type": contentType,
      "x-sentry-auth": sentryAuthHeader,
    };
    if (contentEncoding) {
      headers["content-encoding"] = contentEncoding;
    }

    const req = new NextRequest(
      new URL(`http://localhost/api/sentry/${projectId}/envelope`),
      {
        method: "POST",
        body: bodyToArrayBuffer(captured.bodyRaw),
        headers,
      },
    );

    const res = await POST(req, {
      params: Promise.resolve({ project_id: projectId }),
    });
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(typeof json.id).toBe("string");
    expect(processError).toHaveBeenCalledTimes(1);
  });
});

function headerValue(value: string | string[] | undefined): string | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) return value.join(", ");
  return value;
}

function bodyToArrayBuffer(body: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(body.byteLength);
  copy.set(body);
  return copy.buffer;
}
