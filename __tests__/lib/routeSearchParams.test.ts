// @vitest-environment node

import { describe, expect, it } from "vitest";
import {
  getSingleSearchParam,
  toNoticeSearchParams,
  toOccurrenceSearchParams,
} from "@/lib/routeSearchParams";

describe("getSingleSearchParam", () => {
  it("returns a scalar value unchanged", () => {
    expect(getSingleSearchParam({ tab: "context" }, "tab")).toBe("context");
  });

  it("returns the first value for repeated query params", () => {
    expect(getSingleSearchParam({ tab: ["params", "chart"] }, "tab")).toBe(
      "params",
    );
  });

  it("returns undefined when the key is missing", () => {
    expect(getSingleSearchParam({}, "tab")).toBeUndefined();
  });
});

describe("toNoticeSearchParams", () => {
  it("normalizes repeated route query values to scalar notice filters", () => {
    expect(
      toNoticeSearchParams({
        filterByEnv: ["production", "staging"],
        searchQuery: ["timeout", "ignored"],
        sortAttr: ["seen_count", "updated_at"],
        sortDir: ["asc", "desc"],
      }),
    ).toEqual({
      filterByEnv: "production",
      searchQuery: "timeout",
      sortAttr: "seen_count",
      sortDir: "asc",
    });
  });
});

describe("toOccurrenceSearchParams", () => {
  it("normalizes repeated route query values to scalar occurrence filters", () => {
    expect(
      toOccurrenceSearchParams({
        searchQuery: ["timeout", "ignored"],
        sortAttr: ["updated_at", "seen_count"],
        sortDir: ["desc", "asc"],
      }),
    ).toEqual({
      searchQuery: "timeout",
      sortAttr: "updated_at",
      sortDir: "desc",
    });
  });
});
