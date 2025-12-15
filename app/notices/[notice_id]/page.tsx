// app/notices/[notice_id]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import CustomTimeAgo from "@/components/CustomTimeAgo";
import EnvironmentLabel from "@/components/EnvironmentLabel";
import OccurrencesTable from "@/components/OccurrencesTable";
import { Badge } from "@/components/ui/badge";
import { getNoticeById } from "@/lib/queries/notices";
import Sort from "./Sort";
import type { Metadata } from "next";

type ComponentProps = {
  params: Promise<{ notice_id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export async function generateMetadata(
  props: ComponentProps,
): Promise<Metadata> {
  const noticeId = (await props.params).notice_id;
  const notice = await getNoticeById(noticeId);
  return { title: `(${notice?.project?.name}) ${notice?.kind}` };
}

// /notices/:notice_id
export default async function Notice(props: ComponentProps) {
  const [resolvedSearchParams, resolvedParams] = await Promise.all([
    props.searchParams,
    props.params,
  ]);

  const notice = await getNoticeById(resolvedParams.notice_id);
  if (!notice) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Notice header */}
      <section className="rounded-xl border border-card/40 bg-card/40 p-4 shadow-md ring-1 ring-card/40 backdrop-blur sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium text-muted-foreground">
              Project
            </div>
            <Link
              href={`/projects/${notice.project.id}`}
              className="mt-1 block truncate text-sm font-semibold text-foreground underline decoration-current underline-offset-4 hover:text-foreground/80"
            >
              {notice.project.organization} / {notice.project.name}
            </Link>

            <h1 className="mt-3 max-w-full text-xl font-semibold leading-tight text-foreground wrap-anywhere">
              {notice.kind}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <EnvironmentLabel env={notice.env} />
            <Badge variant="outline">
              Seen: {notice.seen_count.toString()}
            </Badge>
            <Badge variant="secondary">
              Updated <CustomTimeAgo date={new Date(notice.updated_at)} />
            </Badge>
          </div>
        </div>
      </section>

      {/* Occurrences */}
      <section className="rounded-xl sm:overflow-hidden sm:border sm:border-card/40 sm:bg-card/40 sm:shadow-md sm:ring-1 sm:ring-card/40 sm:backdrop-blur">
        <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-lg border border-card/40 bg-card/40 px-4 py-3 shadow-xs sm:rounded-none sm:border-0 sm:bg-transparent sm:shadow-none sm:border-b sm:border-card/40">
          <h2 className="text-sm font-semibold text-foreground">Occurrences</h2>
          <div className="flex items-center gap-2">
            <Sort />
          </div>
        </div>

        <OccurrencesTable
          noticeId={notice.id}
          searchParams={resolvedSearchParams}
        />
      </section>
    </div>
  );
}
