import type { NoticeSearchParams } from "@/lib/queries/notices";
import type { OccurrenceSearchParams } from "@/lib/queries/occurrences";

export type RouteSearchParams = Record<string, string | string[] | undefined>;

export function getSingleSearchParam(
  searchParams: RouteSearchParams,
  key: string,
): string | undefined {
  const value = searchParams[key];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function toNoticeSearchParams(
  searchParams: RouteSearchParams,
): NoticeSearchParams {
  return {
    filterByEnv: getSingleSearchParam(searchParams, "filterByEnv"),
    searchQuery: getSingleSearchParam(searchParams, "searchQuery"),
    sortAttr: getSingleSearchParam(
      searchParams,
      "sortAttr",
    ) as NoticeSearchParams["sortAttr"],
    sortDir: getSingleSearchParam(
      searchParams,
      "sortDir",
    ) as NoticeSearchParams["sortDir"],
  };
}

export function toOccurrenceSearchParams(
  searchParams: RouteSearchParams,
): OccurrenceSearchParams {
  return {
    searchQuery: getSingleSearchParam(searchParams, "searchQuery"),
    sortAttr: getSingleSearchParam(
      searchParams,
      "sortAttr",
    ) as OccurrenceSearchParams["sortAttr"],
    sortDir: getSingleSearchParam(
      searchParams,
      "sortDir",
    ) as OccurrenceSearchParams["sortDir"],
  };
}
