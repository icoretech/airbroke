// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const {
  getSessionMock,
  findFirstMock,
  openaiResponsesMock,
  createOpenAIMock,
  streamTextMock,
} = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
  findFirstMock: vi.fn(),
  openaiResponsesMock: vi.fn(),
  createOpenAIMock: vi.fn(),
  streamTextMock: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: getSessionMock,
    },
  },
}));

vi.mock("next/server", () => ({
  NextRequest: class NextRequest extends Request {},
}));

vi.mock("@/lib/db", () => ({
  db: {
    occurrence: {
      findFirst: findFirstMock,
    },
  },
}));

vi.mock("@ai-sdk/openai", () => ({
  createOpenAI: createOpenAIMock,
}));

vi.mock("ai", () => ({
  streamText: streamTextMock,
}));

const { POST, MAX_PROMPT_LENGTH } = await import("@/app/api/completion/route");

describe("POST /api/completion", () => {
  const previousApiKey = process.env.AIRBROKE_OPENAI_API_KEY;
  const previousEngine = process.env.AIRBROKE_OPENAI_ENGINE;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.AIRBROKE_OPENAI_API_KEY = "test-openai-key";
    process.env.AIRBROKE_OPENAI_ENGINE = "gpt-4o";

    getSessionMock.mockResolvedValue({
      session: { id: "session-1" },
      user: { id: "user-1" },
    });
    findFirstMock.mockResolvedValue({
      id: "occ-1",
      message: `${"A".repeat(5000)}TAIL_MESSAGE_MARKER`,
      backtrace: Array.from({ length: 50 }, (_, index) => ({
        file: `frame-${index}`,
        line: index,
        function: index === 49 ? "TAIL_BACKTRACE_MARKER" : `fn-${index}`,
      })),
      notice: {
        id: "notice-1",
        kind: "TypeError",
        project: {
          id: "project-1",
          name: "Project 1",
        },
      },
    });
    openaiResponsesMock.mockReturnValue({ provider: "mock-model" });
    createOpenAIMock.mockReturnValue({
      responses: openaiResponsesMock,
    });
    streamTextMock.mockReturnValue({
      toTextStreamResponse: () => new Response("ok"),
    });
  });

  afterEach(() => {
    if (previousApiKey === undefined) {
      delete process.env.AIRBROKE_OPENAI_API_KEY;
    } else {
      process.env.AIRBROKE_OPENAI_API_KEY = previousApiKey;
    }

    if (previousEngine === undefined) {
      delete process.env.AIRBROKE_OPENAI_ENGINE;
    } else {
      process.env.AIRBROKE_OPENAI_ENGINE = previousEngine;
    }
  });

  it("caps oversized completion prompts before calling OpenAI", async () => {
    const res = await POST(
      new Request("http://localhost/api/completion", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          occurrenceId: "occ-1",
          isDetailMode: true,
        }),
      }) as unknown as import("next/server").NextRequest,
    );

    expect(res.status).toBe(200);
    expect(streamTextMock).toHaveBeenCalledTimes(1);

    const streamArgs = streamTextMock.mock.calls[0]?.[0] as {
      messages: Array<{ role: string; content: string }>;
    };
    const prompt = streamArgs.messages[0]?.content ?? "";

    expect(prompt.length).toBeLessThanOrEqual(MAX_PROMPT_LENGTH);
    expect(prompt).not.toContain("TAIL_MESSAGE_MARKER");
    expect(prompt).not.toContain("TAIL_BACKTRACE_MARKER");
  });
});
