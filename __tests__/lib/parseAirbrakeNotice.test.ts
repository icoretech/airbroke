import { describe, expect, it } from "vitest";
import parseNotice from "@/lib/parseNotice";
import type { NoticeData } from "@/lib/parseNotice";

describe("parseNotice (Airbrake notice sanitizer)", () => {
  it("normalizes missing fields safely", () => {
    const input = {
      errors: [],
      context: undefined,
      environment: undefined,
      session: undefined,
      params: undefined,
    } as unknown as NoticeData;

    const parsed = parseNotice(input);

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
        {
          // missing everything
        },
      ],
      context: {},
      environment: {},
      session: {},
      params: {},
    } as unknown as NoticeData;

    const parsed = parseNotice(input);

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
});
