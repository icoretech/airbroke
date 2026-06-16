// lib/sentryConfigTemplates.ts

//
// JavaScript / TypeScript (Browser)
//
export const sentryBrowserTemplate = `
import { captureException, flush, init } from "@sentry/browser";

init({
  // Sentry requires a DSN string, even when using a tunnel.
  // Airbroke uses the project API key as the DSN "public key".
  // The numeric project id in the DSN can be any number (e.g. 1).
  dsn: "https://{REPLACE_PROJECT_KEY}@{REPLACE_AIRBROKE_HOST}/1",

  // Route envelopes to Airbroke's Sentry-compatible intake.
  // Prefer query auth to avoid CORS preflights.
  tunnel:
    "{REPLACE_AIRBROKE_URL}/api/sentry/{REPLACE_PROJECT_ID}/envelope?sentry_key={REPLACE_PROJECT_KEY}",

  environment: "production",
  release: "myapp@1.0.0",

  // Keep it errors-only (disable tracing, sessions/outcomes, etc).
  tracesSampleRate: 0,
  sampleRate: 1,
  sendClientReports: false,
  sendDefaultPii: false,
  maxBreadcrumbs: 0,

  // Disable default integrations to avoid extra envelope items.
  defaultIntegrations: false,
  integrations: [],

  // Optional hardening: strip extra fields so Airbroke stores only the exception.
  beforeSend(event) {
    event.user = undefined;
    event.request = undefined;
    event.tags = undefined;
    event.extra = undefined;
    event.contexts = undefined;
    event.breadcrumbs = undefined;
    return event;
  },
});

captureException(new Error("Hello from Airbroke (Sentry Browser)"));
flush(2000);
`;

//
// JavaScript / TypeScript (Node.js)
//
export const sentryNodeTemplate = `
import { captureException, flush, init } from "@sentry/node";

init({
  // Sentry requires a DSN string, even when using a tunnel.
  // Airbroke uses the project API key as the DSN "public key".
  // The numeric project id in the DSN can be any number (e.g. 1).
  dsn: "https://{REPLACE_PROJECT_KEY}@{REPLACE_AIRBROKE_HOST}/1",

  // Route envelopes to Airbroke's Sentry-compatible intake.
  tunnel:
    "{REPLACE_AIRBROKE_URL}/api/sentry/{REPLACE_PROJECT_ID}/envelope?sentry_key={REPLACE_PROJECT_KEY}",

  environment: "production",
  release: "myapp@1.0.0",

  // Keep it errors-only (disable tracing, sessions/outcomes, etc).
  tracesSampleRate: 0,
  sampleRate: 1,
  sendClientReports: false,
  sendDefaultPii: false,
  maxBreadcrumbs: 0,

  // Disable default integrations to avoid extra envelope items.
  defaultIntegrations: false,
  integrations: [],

  // Optional hardening: strip extra fields so Airbroke stores only the exception.
  beforeSend(event) {
    event.user = undefined;
    event.request = undefined;
    event.tags = undefined;
    event.extra = undefined;
    event.contexts = undefined;
    event.breadcrumbs = undefined;
    return event;
  },
});

captureException(new Error("Hello from Airbroke (Sentry Node)"));
flush(2000);
`;
