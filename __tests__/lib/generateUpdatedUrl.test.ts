// __tests__/lib/generateUpdatedUrl.test.ts

import { describe, expect, it } from "vitest";
import { generateUpdatedURL } from "@/lib/generateUpdatedUrl";

/**
 * Helper to simulate ReadonlyURLSearchParams
 * (in practice, just using `new URLSearchParams(...)` is enough,
 * because we only need the `.toString()` behavior in the code).
 */
function makeParams(object: Record<string, string>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(object)) {
    params.set(key, value);
  }
  return params;
}

describe("generateUpdatedURL", () => {
  it("should return the same URL if no new params are provided", () => {
    const currentParams = makeParams({ foo: "bar", baz: "qux" });
    const newParams = {};
    const result = generateUpdatedURL("/test", currentParams, newParams);
    expect(result).toBe("/test?foo=bar&baz=qux");
  });

  it("should override an existing param if present in new params", () => {
    const currentParams = makeParams({ foo: "bar", baz: "qux" });
    const newParams = { foo: "updated" };
    const result = generateUpdatedURL("/test", currentParams, newParams);
    // 'foo' gets updated to 'updated'; 'baz' remains
    expect(result).toBe("/test?foo=updated&baz=qux");
  });

  it("should add new param if it does not exist in current params", () => {
    const currentParams = makeParams({ foo: "bar" });
    const newParams = { baz: "qux" };
    const result = generateUpdatedURL("/test", currentParams, newParams);
    // 'baz' is newly added
    expect(result).toBe("/test?foo=bar&baz=qux");
  });

  it("should add multiple new or override multiple existing params", () => {
    const currentParams = makeParams({ foo: "bar", beep: "boop" });
    const newParams = { foo: "updated", extra: "value" };
    const result = generateUpdatedURL("/test", currentParams, newParams);
    // 'foo' overwritten, 'extra' added, 'beep' stays as is
    expect(result).toBe("/test?foo=updated&beep=boop&extra=value");
  });

  it("should handle empty existing params gracefully", () => {
    const currentParams = makeParams({});
    const newParams = { foo: "bar" };
    const result = generateUpdatedURL("/test", currentParams, newParams);
    // Only 'foo=bar' is present
    expect(result).toBe("/test?foo=bar");
  });

  it("should work if newParams is empty, returning the original query", () => {
    const currentParams = makeParams({ existing: "param" });
    const newParams = {};
    const result = generateUpdatedURL("/test", currentParams, newParams);
    expect(result).toBe("/test?existing=param");
  });

  it("should handle a path that has no leading slash (not recommended but feasible)", () => {
    const currentParams = makeParams({ foo: "bar" });
    const newParams = { extra: "123" };
    // Notice the pathname is just "test" without slash
    const result = generateUpdatedURL("test", currentParams, newParams);
    expect(result).toBe("test?foo=bar&extra=123");
  });
});
