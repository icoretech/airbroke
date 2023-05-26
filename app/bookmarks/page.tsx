import Breadcrumbs from '@/components/Breadcrumbs';
import OccurrencesTable from '@/components/OccurrencesTable';
import Search from '@/components/Search';
import SidebarDesktop from '@/components/SidebarDesktop';
import SidebarMobile from '@/components/SidebarMobile';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import type { Route } from 'next';
import { getServerSession } from 'next-auth';

export const revalidate = 60;

export default async function Bookmarks({ searchParams }: { searchParams: Record<string, string> }) {
  const session = await getServerSession(authOptions);

  const search = searchParams.q;

  const whereObject: any = {
    user_id: session?.user?.id,
    ...(search && { message: { contains: search, mode: 'insensitive' } }),
  };

  const occurrenceBookmarks = await prisma.occurrenceBookmark.findMany({
    where: whereObject,
    select: { occurrence_id: true },
    orderBy: { created_at: 'asc' },
  });
  const occurrencesIds = occurrenceBookmarks.map((bookmark) => bookmark.occurrence_id);

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
          {/* @ts-expect-error Server Component */}
          <SidebarDesktop />
        </SidebarMobile>

        <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
          {/* @ts-expect-error Server Component */}
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
                <Search currentSearchTerm={search} />
              </div>
            </div>
          </div>

          {/* @ts-expect-error Server Component */}
          <OccurrencesTable occurrencesIds={occurrencesIds} />
        </main>
      </div>
    </>
  );
}
