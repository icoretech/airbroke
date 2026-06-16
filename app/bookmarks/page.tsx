// app/bookmarks/page.tsx

import BookmarksTable from "@/components/bookmarks/BookmarksTable";
import { getSingleSearchParam } from "@/lib/routing/routeSearchParams";

export default async function Bookmarks(props: PageProps<"/bookmarks">) {
  const searchParams = await props.searchParams;
  const searchQuery = getSingleSearchParam(searchParams, "searchQuery");
  return <BookmarksTable searchQuery={searchQuery} />;
}
