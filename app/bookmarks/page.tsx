// app/bookmarks/page.tsx

import BookmarksTable from '@/components/BookmarksTable';
import { DashboardShell } from '@/components/DashboardShell';
import { cookies } from 'next/headers';

export default async function Bookmarks(props: { searchParams: Promise<Record<string, string>> }) {
  const cookieStore = await cookies();
  const initialSidebarOpen = cookieStore.get('sidebarOpen')?.value === 'true';

  const searchParams = await props.searchParams;
  const searchQuery = searchParams.searchQuery;

  return (
    <DashboardShell initialSidebarOpen={initialSidebarOpen}>
      <BookmarksTable searchQuery={searchQuery} />
    </DashboardShell>
  );
}
