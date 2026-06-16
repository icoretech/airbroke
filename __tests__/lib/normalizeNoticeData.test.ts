import { describe, expect, it } from "vitest";
import normalizeNoticeData from "@/lib/intake/normalizeNoticeData";

describe("normalizeNoticeData", () => {
  it("normalizes non-object input safely", () => {
    const parsed = normalizeNoticeData(null);

    expect(parsed).toEqual({
      errors: [],
      context: {},
      environment: {},
      session: {},
      params: {},
    });
  });

  it("normalizes missing fields safely", () => {
    const input = {
      errors: [],
      context: undefined,
      environment: undefined,
      session: undefined,
      params: undefined,
    };

    const parsed = normalizeNoticeData(input);

    expect(parsed).toEqual({
      errors: [],
      context: {},
      environment: {},
      session: {},
      params: {},
    });
  });

  it("fills default error fields and backtrace shape", () => {
    const input = {
      errors: [
        {
          type: "",
          message: "",
          backtrace: [
            { file: "a.ts", line: 1, function: "a" },
            { file: "b.ts", line: 2, function: "b" },
          ],
        },
        {},
      ],
      context: {},
      environment: {},
      session: {},
      params: {},
    };

    const parsed = normalizeNoticeData(input);

    expect(parsed.errors[0]?.type).toBe("UnknownError");
    expect(parsed.errors[0]?.message).toBe("No message provided");
    expect(parsed.errors[0]?.backtrace).toEqual([
      { file: "a.ts", line: 1, function: "a" },
      { file: "b.ts", line: 2, function: "b" },
    ]);

    expect(parsed.errors[1]).toEqual({
      type: "UnknownError",
      message: "No message provided",
      backtrace: [],
    });
  });

  it("normalizes malformed raw error entries without trusting their shape", () => {
    const parsed = normalizeNoticeData({
      errors: [
        null,
        {
          type: 123,
          message: ["not", "a", "string"],
          backtrace: [
            null,
            { file: 10, line: "20", function: false },
            { file: "valid.ts", line: 30, function: "run" },
          ],
        },
      ],
    });

    expect(parsed.errors).toEqual([
      {
        type: "UnknownError",
        message: "No message provided",
        backtrace: [],
      },
      {
        type: "UnknownError",
        message: "No message provided",
        backtrace: [
          { file: "", line: 0, function: "" },
          { file: "", line: 0, function: "" },
          { file: "valid.ts", line: 30, function: "run" },
        ],
      },
    ]);
  });
});
