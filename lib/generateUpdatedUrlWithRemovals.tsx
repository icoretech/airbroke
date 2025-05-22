// lib/generateUpdatedUrlWithRemovals.tsx

import type { Route } from 'next';
import type { ReadonlyURLSearchParams } from 'next/navigation';

type UpdatedParams = Record<string, string | undefined>;

type RemoveParams = string[];

/**
 * Extended version of generateUpdatedURL that allows removing
 * certain params entirely. If the new value is `undefined`,
 * we remove that param from the URL.
 */
export function generateUpdatedURLWithRemovals(
  pathname: string,
  currentParams: URLSearchParams | ReadonlyURLSearchParams,
  newParams: UpdatedParams,
  removeParams?: RemoveParams
) {
  const updatedParams = new URLSearchParams(currentParams.toString());

  // Overwrite or remove as needed
  for (const key in newParams) {
    const value = newParams[key];
    if (value === undefined) {
      updatedParams.delete(key);
    } else {
      updatedParams.set(key, value);
    }
  }

  // Also remove any specifically listed
  if (removeParams) {
    removeParams.forEach((p) => updatedParams.delete(p));
  }

  const searchString = updatedParams.toString();
  return searchString ? (`${pathname}?${searchString}` as Route) : (pathname as Route);
}
