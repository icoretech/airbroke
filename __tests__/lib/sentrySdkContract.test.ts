import { serializeEnvelope } from "@sentry/core";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { startCaptureServer } from "@/__tests__/helpers/captureServer";
import type {
  Envelope,
  Transport,
  TransportMakeRequestResponse,
} from "@sentry/core";

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

  it("accepts envelope produced by @sentry/node", async () => {
    const projectId = "p1";
    const projectKey = "k1";
    const captured: { serialized: string }[] = [];

    const transport: Transport = {
      async send(envelope: Envelope): Promise<TransportMakeRequestResponse> {
        const serialized = serializeEnvelope(envelope);
        captured.push({
          serialized:
            typeof serialized === "string"
              ? serialized
              : Buffer.from(serialized).toString("utf8"),
        });
        return {};
      },
      async flush() {
        return true;
      },
    };

    const SentryNode = await import("@sentry/node");
    type InitOptions = NonNullable<Parameters<typeof SentryNode.init>[0]>;
    type TransportFactory = NonNullable<InitOptions["transport"]>;
    const customTransport: TransportFactory = () => transport;

    SentryNode.init({
      dsn: "https://public@example.ingest.sentry.io/1",
      environment: "test-env",
      release: "airbroke-test@1.0.0",
      transport: customTransport,
      tracesSampleRate: 0,
      sampleRate: 1,
      sendClientReports: false,
      defaultIntegrations: false,
      integrations: [],
    });

    const eventId = SentryNode.captureException(new Error("boom"));
    await SentryNode.flush(2000);
    await SentryNode.close(0);

    const eventEnvelope =
      captured.find(({ serialized }) =>
        serialized.includes('"type":"event"'),
      ) ?? captured[0];

    expect(eventId).toBeDefined();
    expect(eventEnvelope?.serialized).toContain('"type":"event"');

    vi.mocked(db.project.findFirst).mockResolvedValue({
      id: projectId,
      api_key: projectKey,
      paused: false,
    } as unknown as Awaited<ReturnType<typeof db.project.findFirst>>);

    const req = new NextRequest(
      new URL(
        `http://localhost/api/sentry/${projectId}/envelope?sentry_key=${projectKey}`,
      ),
      {
        method: "POST",
        body: eventEnvelope?.serialized ?? "",
        headers: {
          "content-type": "application/x-sentry-envelope",
        },
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
    expect(captured?.body).toContain('"type":"event"');

    vi.mocked(db.project.findFirst).mockResolvedValue({
      id: projectId,
      api_key: projectKey,
      paused: false,
    } as unknown as Awaited<ReturnType<typeof db.project.findFirst>>);

    const req = new NextRequest(
      new URL(
        `http://localhost/api/sentry/${projectId}/envelope?sentry_key=${projectKey}`,
      ),
      {
        method: "POST",
        body: captured.body,
        headers: {
          "content-type": "application/x-sentry-envelope",
        },
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
