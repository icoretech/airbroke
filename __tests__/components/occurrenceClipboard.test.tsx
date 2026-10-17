import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import ClipboardButton from "@/components/occurrence/ClipboardButton";

describe("occurrence clipboard controls", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  test("copies JSON through a real Base UI button and restores its label", () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    render(<ClipboardButton json={{ file: "sample.ts", line: 42 }} />);
    const button = screen.getByRole("button", { name: "Copy JSON" });
    fireEvent.click(button);
    expect(writeText).toHaveBeenCalledWith(
      '{\n  "file": "sample.ts",\n  "line": 42\n}',
    );
    expect(screen.getByRole("button", { name: "Copied!" })).toBe(button);
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByRole("button", { name: "Copy JSON" })).toBe(button);
  });

  test("preserves the plain text copy format", () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    render(<ClipboardButton json="sample.ts : 42 → run" text />);
    fireEvent.click(screen.getByRole("button", { name: "Copy Text" }));
    expect(writeText).toHaveBeenCalledWith("sample.ts : 42 → run");
  });
});
