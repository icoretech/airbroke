// app/notices/[notice_id]/page.tsx

import { DashboardShell } from '@/components/DashboardShell';
import OccurrencesTable from '@/components/OccurrencesTable';
import { getNoticeById } from '@/lib/queries/notices';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type ComponentProps = {
  params: Promise<{ notice_id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export async function generateMetadata(props: ComponentProps) {
  const noticeId = (await props.params).notice_id;
  const notice = await getNoticeById(noticeId);
  return { title: `(${notice?.project?.name}) ${notice?.kind}` };
}

// /notices/:notice_id
export default async function Notice(props: ComponentProps) {
  const [cookieStore, resolvedSearchParams, resolvedParams] = await Promise.all([
    cookies(),
    props.searchParams,
    props.params,
  ]);
  const initialSidebarOpen = cookieStore.get('sidebarOpen')?.value === 'true';

  const notice = await getNoticeById(resolvedParams.notice_id);
  if (!notice) {
    notFound();
  }

  return (
    <DashboardShell initialSidebarOpen={initialSidebarOpen} selectedProjectId={notice.project.id}>
      <header className="border-b border-white/5 bg-gradient-to-r from-airbroke-800 to-airbroke-900 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-bold leading-6 text-indigo-400">
            <Link href={`/projects/${notice.project.id}`}>
              {notice.project.organization} / {notice.project.name}
            </Link>
          </h1>
          <p className="mt-1 text-sm text-indigo-200">{notice.kind}</p>
        </div>

        <div className="mt-4 flex sm:ml-4 sm:mt-0">
          <Link
            href={`/projects/${notice.project.id}/edit`}
            className="inline-flex items-center gap-x-2 rounded-md bg-indigo-400/10 px-3 py-2 text-sm font-semibold text-indigo-400 shadow-sm ring-1 ring-indigo-400/30 transition-colors duration-200 hover:bg-indigo-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Edit Project
          </Link>
        </div>
      </header>

      <OccurrencesTable noticeId={notice.id} searchParams={resolvedSearchParams} />
    </DashboardShell>
  );
}
