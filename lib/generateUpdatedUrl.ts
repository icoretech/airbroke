// lib/generateUpdatedUrl.ts

import type { Route } from "next";
import type { ReadonlyURLSearchParams } from "next/navigation";

export function generateUpdatedURL(
  pathname: string,
  currentParams: URLSearchParams | ReadonlyURLSearchParams,
  newParams: Record<string, string>,
) {
  // Copy existing search params
  const updatedParams = new URLSearchParams(currentParams.toString());

  // Overwrite with new params
  for (const key in newParams) {
    updatedParams.set(key, newParams[key]);
  }

  // Return a typed route string
  return `${pathname}?${updatedParams.toString()}` as Route;
}
