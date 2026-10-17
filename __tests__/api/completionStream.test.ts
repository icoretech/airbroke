// @vitest-environment node

import { callCompletionApi } from "ai";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/completion/route";

vi.mock("@/lib/auth", () => ({
  getAuth: () => ({
    api: { getSession: async () => ({ user: { id: "sample-user" } }) },
  }),
}));

vi.mock("@/lib/db", () => ({
  db: {
    occurrence: {
      findFirst: async () => ({
        id: "sample-occurrence",
        message: "sample error",
        backtrace: [],
        notice: { kind: "TypeError", project: { id: "sample-project" } },
      }),
    },
  },
}));

async function consumeCompletion() {
  const state: { completion: string; error?: Error; loading: boolean } = {
    completion: "",
    loading: false,
  };
  await callCompletionApi({
    api: "http://localhost/api/completion",
    prompt: "sample-occurrence",
    credentials: undefined,
    headers: undefined,
    body: {},
    streamProtocol: "data",
    setCompletion: (text) => {
      state.completion = text;
    },
    setLoading: (loading) => {
      state.loading = loading;
    },
    setError: (error) => {
      state.error = error;
    },
    setAbortController: () => {},
    onFinish: undefined,
    onError: undefined,
    fetch: async (_url, init) =>
      POST(
        new NextRequest("http://localhost/api/completion", {
          ...init,
          signal: init?.signal ?? undefined,
        }),
      ),
  });
  return state;
}

function upstreamStream(events: readonly object[]) {
  return new Response(
    events.map((event) => `data: ${JSON.stringify(event)}\n\n`).join(""),
    { headers: { "Content-Type": "text/event-stream" } },
  );
}

const textEvents = [
  {
    type: "response.created",
    response: { id: "resp_sample", created_at: 1, model: "gpt-4o" },
  },
  {
    type: "response.output_item.added",
    output_index: 0,
    item: { type: "message", id: "msg_sample" },
  },
  {
    type: "response.output_text.delta",
    item_id: "msg_sample",
    delta: "Sample ",
  },
  {
    type: "response.output_text.delta",
    item_id: "msg_sample",
    delta: "explanation",
  },
];

describe("completion SDK stream contract", () => {
  beforeEach(() => {
    vi.stubEnv("AIRBROKE_OPENAI_API_KEY", "sample-test-key");
    vi.stubEnv("AIRBROKE_OPENAI_ENGINE", "gpt-4o");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("surfaces a sanitized error when the real provider rejects credentials", async () => {
    // Given an HTTP failure at the real OpenAI SDK boundary.
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json(
          {
            error: {
              message:
                "invalid credential sample-test-key private upstream detail",
              type: "invalid_request_error",
              code: "invalid_api_key",
            },
          },
          { status: 401 },
        ),
      ),
    );
    const log = vi.spyOn(console, "error").mockImplementation(() => {});

    // When the real route and completion parser consume the provider response.
    const state = await consumeCompletion();

    // Then the client gets actionable failure state, without upstream details.
    expect(state.error?.message).toMatch(/could not generate an explanation/i);
    expect(state.error?.message).not.toContain("sample-test-key");
    expect(state.error?.message).not.toContain("private upstream detail");
    expect(state.loading).toBe(false);
    expect(log).toHaveBeenCalledExactlyOnceWith(
      "AI explanation generation failed",
    );
  });

  it("streams successful provider output through the real completion parser", async () => {
    // Given a valid Responses API event stream.
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        upstreamStream([
          ...textEvents,
          { type: "response.completed", response: {} },
        ]),
      ),
    );

    // When the route adapts and the client parses that stream.
    const state = await consumeCompletion();

    // Then tokens arrive as plain completion text and loading finishes.
    expect(state).toEqual({
      completion: "Sample explanation",
      error: undefined,
      loading: false,
    });
  });

  it("preserves partial output and surfaces a sanitized midstream error", async () => {
    // Given a provider failure after text has already streamed.
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        upstreamStream([
          ...textEvents,
          {
            type: "response.failed",
            sequence_number: 5,
            response: {
              error: {
                code: "server_error",
                message: "private upstream detail",
              },
            },
          },
        ]),
      ),
    );
    vi.spyOn(console, "error").mockImplementation(() => {});

    // When the real SDK handles the failed response.
    const state = await consumeCompletion();

    // Then the partial result is retained and failure is visible.
    expect(state.completion).toBe("Sample explanation");
    expect(state.error?.message).toMatch(/could not generate an explanation/i);
    expect(state.error?.message).not.toContain("private upstream detail");
    expect(state.loading).toBe(false);
  });
});
