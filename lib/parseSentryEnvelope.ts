// lib/parseSentryEnvelope.ts

import {
  envelopeContainsItemType,
  forEachEnvelopeItem,
  parseEnvelope,
} from "@sentry/core";
import type { Envelope } from "@sentry/core";
import type { NoticeData, NoticeError } from "@/lib/parseNotice";

type EnvelopeHeader = {
  sdk?: { name?: string; version?: string };
  sent_at?: string;
};

type EventItemHeader = {
  type: "event";
  content_type?: string;
};

type SentryException = {
  type?: string;
  value?: string;
  stacktrace?: {
    frames?: Array<{
      filename?: string;
      function?: string;
      lineno?: number;
      colno?: number;
    }>;
  };
};

type SentryEvent = {
  event_id?: string;
  environment?: string;
  release?: string;
  platform?: string;
  logger?: string;
  level?: string;
  transaction?: string;
  user?: Record<string, unknown>;
  request?: Record<string, unknown>;
  extra?: Record<string, unknown>;
  contexts?: Record<string, unknown>;
  tags?: Record<string, unknown>;
  exception?: { values?: SentryException[] };
};

/**
 * Best-effort parser for Sentry envelopes as serialized by `serializeEnvelope`.
 * Focuses on `event` items and normalizes them into NoticeData compatible with
 * the Airbrake-like processing pipeline.
 */
export interface ParsedSentryNotice {
  notice: NoticeData;
  eventId?: string;
}

export function parseSentryEnvelope(envelopeInput: string | Uint8Array): {
  header: EnvelopeHeader;
  notices: ParsedSentryNotice[];
} {
  const envelope = parseEnvelope(envelopeInput);
  const header = (envelope[0] as EnvelopeHeader) ?? {};
  const notices: ParsedSentryNotice[] = [];

  if (!envelopeContainsItemType(envelope, ["event"])) {
    return { header, notices };
  }

  forEachEnvelopeItem<Envelope>(envelope, (item) => {
    const itemHeader = item[0] as EventItemHeader;
    if (itemHeader.type !== "event") return;

    const payload = item[1];

    let event: SentryEvent | null = null;
    if (typeof payload === "string") {
      event = safeJson<SentryEvent>(payload);
    } else if (payload instanceof Uint8Array) {
      event = safeJson<SentryEvent>(Buffer.from(payload).toString("utf8"));
    } else if (payload && typeof payload === "object") {
      event = payload as SentryEvent;
    }

    if (!event) return;

    const notice = sentryEventToNotice(event);
    notices.push({ notice, eventId: event.event_id });
  });

  return { header, notices };
}

function sentryEventToNotice(event: SentryEvent): NoticeData {
  const exceptions = event.exception?.values ?? [];
  const first = exceptions[0];

  const errors: NoticeError[] = [
    {
      type: first?.type || "Error",
      message: first?.value || "Unknown Sentry error",
      backtrace: (first?.stacktrace?.frames ?? []).map((frame) => ({
        file: frame.filename || "",
        line: frame.lineno ?? 0,
        function: frame.function || "",
      })),
    },
  ];

  const context: Record<string, unknown> = {
    environment: event.environment || "unknown",
    release: event.release,
    transaction: event.transaction,
    logger: event.logger,
    level: event.level,
    platform: event.platform,
    tags: event.tags,
  };

  const environment: Record<string, unknown> = event.contexts ?? {};

  const session: Record<string, unknown> = event.user ?? {};

  const params: Record<string, unknown> =
    (event.request as Record<string, unknown>) ||
    (event.extra as Record<string, unknown>) ||
    {};

  return {
    errors,
    context,
    environment,
    session,
    params,
  };
}

function safeJson<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}
