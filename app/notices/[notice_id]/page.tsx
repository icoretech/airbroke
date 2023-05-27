import Breadcrumbs from '@/components/Breadcrumbs';
import OccurrencesTable from '@/components/OccurrencesTable';
import Search from '@/components/Search';
import SidebarDesktop from '@/components/SidebarDesktop';
import SidebarMobile from '@/components/SidebarMobile';
import ProjectActionsMenu from '@/components/project/ActionsMenu';
import { getNoticeById } from '@/lib/queries/notices';
import type { SortAttribute, SortDirection } from '@/lib/queries/occurrences';
import type { Route } from 'next';
import { Metadata } from 'next';

type ComponentProps = {
  params: { notice_id: string };
  searchParams: { [key: string]: string | undefined };
};

export async function generateMetadata({ params }: ComponentProps): Promise<Metadata> {
  const notice = await getNoticeById(params.notice_id);
  if (!notice) {
    throw new Error('Notice not found');
  }
  return { title: `(${notice.project?.name}) ${notice?.kind}` };
}

// /notices/:notice_id
export default async function Notice({ params, searchParams }: ComponentProps) {
  const notice = await getNoticeById(params.notice_id);
  if (!notice) {
    throw new Error('Notice not found');
  }

  const { sortDir, sortAttr, searchQuery } = searchParams;

  const breadcrumbs = [
    {
      name: `${notice.project.organization.toLowerCase()} / ${notice.project.name.toLowerCase()}`,
      href: `/projects/${notice.project_id}` as Route,
      current: false,
    },
    { name: notice.kind, href: `/notices/${notice.id}` as Route, current: true },
  ];

  return (
    <>
      <div>
        <SidebarMobile>
          {/* @ts-expect-error Server Component */}
          <SidebarDesktop selectedProjectId={notice.project_id} />
        </SidebarMobile>

        <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
          {/* @ts-expect-error Server Component */}
          <SidebarDesktop selectedProjectId={notice.project_id} />
        </div>

        <main className="xl:pl-72">
          <div className="sticky top-0 z-40 bg-airbroke-900">
            <nav className="border-b border-white border-opacity-10 bg-gradient-to-r from-airbroke-800 to-airbroke-900">
              <div className="flex justify-between pr-4 sm:pr-6 lg:pr-6">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <ProjectActionsMenu project={notice.project} />
              </div>
            </nav>

            <div className="flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5  px-4 shadow-sm sm:px-6 lg:px-8">
              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <Search currentSearchTerm={searchQuery} />
              </div>
            </div>
          </div>

          {/* @ts-expect-error Server Component */}
          <OccurrencesTable
            noticeId={notice.id}
            sortDir={sortDir as SortDirection}
            sortAttr={sortAttr as SortAttribute}
            searchQuery={searchQuery}
          />
        </main>
      </div>
    </>
  );
}
