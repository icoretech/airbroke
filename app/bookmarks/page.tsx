import BookmarksTable from '@/components/BookmarksTable';
import Breadcrumbs from '@/components/Breadcrumbs';
import Search from '@/components/Search';
import SidebarDesktop from '@/components/SidebarDesktop';
import SidebarMobile from '@/components/SidebarMobile';
import type { Route } from 'next';

export default async function Bookmarks({ searchParams }: { searchParams: Record<string, string> }) {
  const searchQuery = searchParams.searchQuery;

  const breadcrumbs = [
    {
      name: 'My Bookmarks',
      href: `/bookmarks` as Route,
      current: true,
    },
  ];

  return (
    <>
      <div>
        <SidebarMobile>
          <SidebarDesktop />
        </SidebarMobile>

        <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
          <SidebarDesktop />
        </div>

        <main className="xl:pl-72">
          <div className="sticky top-0 z-40 bg-airbroke-900">
            <nav className="border-b border-white border-opacity-10 bg-gradient-to-r from-airbroke-800 to-airbroke-900">
              <div className="flex justify-between pr-4 sm:pr-6 lg:pr-6">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
              </div>
            </nav>

            <div className="flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5  px-4 shadow-sm sm:px-6 lg:px-8">
              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <Search />
              </div>
            </div>
          </div>

          <BookmarksTable searchQuery={searchQuery} />
        </main>
      </div>
    </>
  );
}
