import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import ToolboxCurl from "@/components/occurrence/toolbox/Curl";
import ToolboxReplay from "@/components/occurrence/toolbox/Replay";
import { performReplay } from "@/lib/actions/occurrenceActions";

vi.mock("@/lib/actions/occurrenceActions", () => ({ performReplay: vi.fn() }));

describe("occurrence toolbox controls", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  test("keeps missing request controls disabled with an explanation", () => {
    render(
      <>
        <ToolboxCurl context={{}} />
        <ToolboxReplay context={{}} />
      </>,
    );
    expect(
      screen.getByRole("button", { name: "Copy" }).hasAttribute("disabled"),
    ).toBe(true);
    expect(
      screen
        .getByRole("button", { name: "Perform Request" })
        .hasAttribute("disabled"),
    ).toBe(true);
    expect(
      screen.getAllByPlaceholderText("No request URL was recorded."),
    ).toHaveLength(2);
  });

  test("shows the generated command in the real read-only textarea", () => {
    render(
      <ToolboxCurl
        context={{
          url: "https://example.com/sample",
          httpMethod: "POST",
          headers: { Accept: "application/json" },
        }}
      />,
    );
    const output = screen.getByRole("textbox", {
      name: "Generated cURL command",
    });
    expect(output.textContent).toBe(
      "curl -v -X POST 'https://example.com/sample' -H 'Accept: application/json'",
    );
    expect(output.hasAttribute("readonly")).toBe(true);
    expect(
      screen.getByRole("button", { name: "Copy" }).hasAttribute("disabled"),
    ).toBe(false);
  });

  test("the real replay button sends the recorded request and displays its result", async () => {
    const context = { url: "https://example.com/sample", httpMethod: "GET" };
    vi.mocked(performReplay).mockResolvedValue({ ok: true, status: 204 });
    render(<ToolboxReplay context={context} />);
    fireEvent.click(screen.getByRole("button", { name: "Perform Request" }));
    await waitFor(() =>
      expect(
        screen.getByRole("textbox", { name: "Replay response output" })
          .textContent,
      ).toBe("HTTP Status Code: 204\nBody hidden"),
    );
    expect(performReplay).toHaveBeenCalledWith(context);
  });
});
