// app/projects/[project_id]/page.tsx

import { notFound } from "next/navigation";
import { Suspense } from "react";
import CopyToClipboardButton from "@/components/common/CopyToClipboardButton";
import NoticesTable from "@/components/notice/NoticesTable";
import StatusFilter from "@/components/notice/StatusFilter";
import { Badge } from "@/components/ui/badge";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "@/components/ui/input-group";
import { getNoticeEnvs } from "@/lib/queries/notices";
import { getProjectById } from "@/lib/queries/projects";
import { toNoticeSearchParams } from "@/lib/routing/routeSearchParams";
import EnvironmentFilter from "./Filter";
import NoticesWithBulkActions from "./NoticesWithBulkActions";
import Sort from "./Sort";
import type { Metadata } from "next";

export async function generateMetadata(
  props: PageProps<"/projects/[project_id]">,
): Promise<Metadata> {
  const projectId = (await props.params).project_id;
  const project = await getProjectById(projectId);
  return { title: project?.name };
}

// /projects/:project_id
export default async function ProjectNotices(
  props: PageProps<"/projects/[project_id]">,
) {
  const [resolvedSearchParams, resolvedParams] = await Promise.all([
    props.searchParams,
    props.params,
  ]);

  const project = await getProjectById(resolvedParams.project_id);
  if (!project) {
    notFound();
  }

  const uniqueEnvArray = await getNoticeEnvs(project.id);

  return (
    <div className="space-y-6">
      {/* Project header */}
      <section className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-semibold leading-none text-foreground">
              {project.name}
            </h1>
            {project.paused && <Badge variant="secondary">Paused</Badge>}
            <Badge variant="outline">
              Notices: {project.notices_count.toString()}
            </Badge>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="min-w-0">
            <div className="mb-1 text-xs font-medium text-muted-foreground">
              API Key
            </div>
            <InputGroup>
              <InputGroupText
                data-api-key
                className="min-w-0 flex-1 truncate px-2.5 font-mono text-xs text-foreground select-all"
              >
                {project.api_key}
              </InputGroupText>
              <InputGroupAddon align="inline-end">
                <CopyToClipboardButton
                  value={project.api_key}
                  size="icon-sm"
                  variant="ghost"
                />
              </InputGroupAddon>
            </InputGroup>
          </div>

          {project.repo_url && (
            <div className="min-w-0">
              <div className="mb-1 text-xs font-medium text-muted-foreground">
                Repository
              </div>
              <a
                href={project.repo_url}
                target="_blank"
                rel="noreferrer"
                className="block truncate text-sm text-foreground underline underline-offset-4 hover:text-foreground/80"
              >
                {project.repo_url}
              </a>
            </div>
          )}

          <div>
            <div className="mb-1 text-xs font-medium text-muted-foreground">
              Branch
            </div>
            <div className="text-sm text-foreground">
              {project.repo_branch ?? "main"}
            </div>
          </div>
        </div>
      </section>

      {/* Notices */}
      <section className="rounded-xl sm:overflow-hidden sm:border sm:border-border sm:bg-card sm:shadow-sm">
        <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-xs sm:rounded-none sm:border-0 sm:border-b sm:border-border sm:bg-transparent sm:shadow-none">
          <h2 className="text-sm font-semibold text-foreground">Notices</h2>
          <div className="flex flex-wrap items-center gap-2">
            <Suspense>
              <StatusFilter />
              <EnvironmentFilter environments={uniqueEnvArray} />
              <Sort />
            </Suspense>
          </div>
        </div>

        <NoticesWithBulkActions
          projectId={project.id}
          activeEnv={toNoticeSearchParams(resolvedSearchParams).filterByEnv}
        >
          <NoticesTable
            searchParams={toNoticeSearchParams(resolvedSearchParams)}
            projectId={project.id}
          />
        </NoticesWithBulkActions>
      </section>
    </div>
  );
}
