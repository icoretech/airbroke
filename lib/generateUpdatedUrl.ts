import type { Route } from 'next';
import type { ReadonlyURLSearchParams } from 'next/navigation';

export function generateUpdatedURL(pathname: string, searchParams: ReadonlyURLSearchParams, paramsToUpdate: Record<string, string>) {
  const updatedParams = new URLSearchParams(searchParams.toString());

  for (const key in paramsToUpdate) {
    updatedParams.set(key, paramsToUpdate[key]);
  }
  return `${pathname}?${updatedParams.toString()}` as Route;
}
