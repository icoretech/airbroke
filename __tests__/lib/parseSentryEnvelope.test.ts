import { describe, expect, it } from "vitest";
import { parseSentryEnvelope } from "@/lib/parseSentryEnvelope";

const sampleEnvelope = [
  '{"sdk":{"name":"sentry.javascript.node","version":"10.30.0"},"sent_at":"2025-01-01T00:00:00.000Z"}',
  '{"type":"event"}',
  '{"event_id":"abc123","environment":"test-env","release":"airbroke-test@1.0.0","platform":"node","logger":"console","level":"error","transaction":"/test","user":{"id":"user-1"},"request":{"url":"https://example.com"},"exception":{"values":[{"type":"Error","value":"boom","stacktrace":{"frames":[{"filename":"/app/index.js","function":"main","lineno":10,"colno":5}]}}]}}',
  '{"type":"span"}',
  '{"span_id":"deadbeef"}',
].join("\n");

describe("parseSentryEnvelope", () => {
  it("normalizes a Sentry event into NoticeData", () => {
    const { header, notices } = parseSentryEnvelope(sampleEnvelope);

    expect(header.sdk?.name).toContain("sentry");
    expect(notices).toHaveLength(1);

    const { notice, eventId } = notices[0];
    expect(eventId).toBe("abc123");
    expect(notice.context.environment).toBe("test-env");
    expect(notice.context.release).toBe("airbroke-test@1.0.0");
    expect(notice.errors[0]?.message).toBe("boom");
    expect(notice.errors[0]?.type).toBe("Error");
    expect(notice.errors[0]?.backtrace[0]?.file).toBe("/app/index.js");
    expect(notice.session.id).toBe("user-1");
    expect(notice.params.url).toBe("https://example.com");
  });
});
