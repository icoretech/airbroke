import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { createUIMessageStreamResponse } from "ai";
import { afterEach, describe, expect, it, vi } from "vitest";
import ToolboxAI from "@/components/occurrence/toolbox/AI";
import type { UIMessageChunk } from "ai";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("occurrence AI completion", () => {
  it("announces stream errors and allows a successful retry", async () => {
    // Given real SDK streams that fail once, then succeed.
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(async () =>
        createUIMessageStreamResponse({
          stream: new ReadableStream<UIMessageChunk>({
            start(controller) {
              controller.enqueue({
                type: "error",
                errorText:
                  "Could not generate an explanation. Please try again.",
              });
              controller.close();
            },
          }),
        }),
      )
      .mockImplementationOnce(async () =>
        createUIMessageStreamResponse({
          stream: new ReadableStream<UIMessageChunk>({
            start(controller) {
              controller.enqueue({ type: "text-start", id: "sample" });
              controller.enqueue({
                type: "text-delta",
                id: "sample",
                delta: "Sample explanation",
              });
              controller.enqueue({ type: "text-end", id: "sample" });
              controller.close();
            },
          }),
        }),
      );
    vi.stubGlobal("fetch", fetchMock);
    render(<ToolboxAI occurrenceId="sample-occurrence" />);

    // When the first completion fails and the user retries with details.
    fireEvent.click(screen.getByRole("button", { name: "Ask" }));
    expect((await screen.findByRole("alert")).textContent).toMatch(
      /could not generate an explanation/i,
    );
    fireEvent.click(screen.getByRole("button", { name: "Ask with details" }));

    // Then the real hook recovers and renders generated text.
    await waitFor(() => {
      expect(screen.getByRole("textbox")).toHaveProperty(
        "value",
        "Sample explanation",
      );
      expect(screen.queryByRole("alert")).toBeNull();
      expect(screen.queryByRole("button", { name: "Stop" })).toBeNull();
    });
    expect(fetchMock.mock.calls[1]?.[1]?.body).toBe(
      JSON.stringify({
        prompt: "sample-occurrence",
        occurrenceId: "sample-occurrence",
        isDetailMode: true,
      }),
    );
  });

  it("stops an active stream while keeping the partial explanation", async () => {
    // Given a stream held open after its first text chunk.
    let aborted = false;
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string, init: RequestInit) => {
        const response = createUIMessageStreamResponse({
          stream: new ReadableStream<UIMessageChunk>({
            start(controller) {
              controller.enqueue({ type: "text-start", id: "sample" });
              controller.enqueue({
                type: "text-delta",
                id: "sample",
                delta: "Partial explanation",
              });
              init.signal?.addEventListener("abort", () => {
                aborted = true;
                controller.error(new DOMException("Stopped", "AbortError"));
              });
            },
          }),
        });
        return response;
      }),
    );
    render(<ToolboxAI occurrenceId="sample-occurrence" />);
    fireEvent.click(screen.getByRole("button", { name: "Ask" }));
    await waitFor(() => {
      expect(screen.getByRole("textbox")).toHaveProperty(
        "value",
        "Partial explanation",
      );
    });

    // When the user cancels through the real hook.
    fireEvent.click(screen.getByRole("button", { name: "Stop" }));

    // Then the request is aborted, partial output remains, and no error appears.
    await waitFor(() => {
      expect(aborted).toBe(true);
      expect(screen.queryByRole("button", { name: "Stop" })).toBeNull();
    });
    expect(screen.getByRole("textbox")).toHaveProperty(
      "value",
      "Partial explanation",
    );
    expect(screen.queryByRole("alert")).toBeNull();
  });
});
