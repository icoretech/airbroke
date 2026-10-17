// app/projects/[project_id]/page.tsx

import { GitBranch, Link2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import CopyToClipboardButton from "@/components/common/CopyToClipboardButton";
import NoticesTable from "@/components/notice/NoticesTable";
import StatusFilter from "@/components/notice/StatusFilter";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <div className="flex flex-col gap-6">
      {/* Project header */}
      <Card aria-labelledby="project-name">
        <CardHeader>
          <CardDescription className="min-w-0 wrap-anywhere">
            {project.organization}
          </CardDescription>
          <CardTitle className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
            <h1
              id="project-name"
              className="min-w-0 text-2xl font-semibold leading-tight wrap-anywhere"
            >
              {project.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">
                {project.notices_count.toString()}{" "}
                {project.notices_count === BigInt(1) ? "notice" : "notices"}
              </Badge>
              {project.paused && <Badge variant="outline">Paused</Badge>}
            </div>
          </CardTitle>
        </CardHeader>
        {project.repo_url && (
          <CardContent className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex min-w-0 items-start gap-2">
              <Link2
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              />
              <a
                href={project.repo_url}
                target="_blank"
                rel="noreferrer"
                className="min-w-0 text-sm underline underline-offset-4 wrap-anywhere hover:text-muted-foreground"
              >
                {project.repo_url}
              </a>
            </div>
            <Badge
              variant="outline"
              className="h-auto min-h-5 min-w-0 max-w-full whitespace-normal"
            >
              <GitBranch aria-hidden="true" data-icon="inline-start" />
              <span className="sr-only">Branch: </span>
              <span className="min-w-0 wrap-anywhere">
                {project.repo_branch ?? "main"}
              </span>
            </Badge>
          </CardContent>
        )}
        <CardFooter className="min-w-0 gap-3">
          <span className="shrink-0 text-xs text-muted-foreground">
            API key
          </span>
          <code
            data-api-key
            className="min-w-0 truncate font-mono text-xs select-all"
          >
            {project.api_key}
          </code>
          <CopyToClipboardButton
            value={project.api_key}
            label="Copy API key"
            size="icon-sm"
            variant="ghost"
          />
        </CardFooter>
      </Card>

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
