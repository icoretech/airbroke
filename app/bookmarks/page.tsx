// app/bookmarks/page.tsx

import BookmarksTable from "@/components/BookmarksTable";

export default async function Bookmarks(props: {
  searchParams: Promise<Record<string, string>>;
}) {
  const searchParams = await props.searchParams;
  const searchQuery = searchParams.searchQuery;
  return <BookmarksTable searchQuery={searchQuery} />;
}
