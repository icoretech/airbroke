// app/bookmarks/page.tsx

import BookmarksTable from "@/components/BookmarksTable";
import { getSingleSearchParam } from "@/lib/routeSearchParams";

export default async function Bookmarks(props: PageProps<"/bookmarks">) {
  const searchParams = await props.searchParams;
  const searchQuery = getSingleSearchParam(searchParams, "searchQuery");
  return <BookmarksTable searchQuery={searchQuery} />;
}
