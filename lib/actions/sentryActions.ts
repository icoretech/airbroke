// lib/actions/sentryActions.ts

"use server";

import { captureException, flush, init } from "@sentry/node";
import { revalidateProjectShellPaths } from "@/lib/actions/revalidateProjectShellPaths";

export async function sendSentryNodeException(
  projectId: string,
  apiKey: string,
  host: string,
): Promise<string> {
  const hostUrl = new URL(host);
  // Sentry's DSN validation requires a numeric projectId in debug builds.
  // We use a placeholder DSN and route real ingestion via `tunnel`.
  const dsn = `https://${apiKey}@${hostUrl.host}/1`;
  const tunnel = `${host}/api/sentry/${projectId}/envelope?sentry_key=${apiKey}`;

  init({
    dsn,
    environment: "test",
    release: "airbroke-test@1.0.0",
    tunnel,
    tracesSampleRate: 0,
    sampleRate: 1,
    sendClientReports: false,
    defaultIntegrations: false,
    integrations: [],
  });

  const eventId = captureException(
    new Error("[Sentry Node] This is a test exception from Airbroke"),
  );
  await flush(5000).catch((e) => {
    console.error("Sentry node test flush failed", e);
  });

  revalidateProjectShellPaths(projectId);
  return eventId;
}
