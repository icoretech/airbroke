// app/projects/[project_id]/page.tsx

import { notFound } from "next/navigation";
import CopyToClipboardButton from "@/components/CopyToClipboardButton";
import NoticesTable from "@/components/NoticesTable";
import { Badge } from "@/components/ui/badge";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { getNoticeEnvs } from "@/lib/queries/notices";
import { getProjectById } from "@/lib/queries/projects";
import EnvironmentFilter from "./Filter";
import Sort from "./Sort";
import type { Metadata } from "next";

type ComponentProps = {
  params: Promise<{ project_id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export async function generateMetadata(
  props: ComponentProps,
): Promise<Metadata> {
  const projectId = (await props.params).project_id;
  const project = await getProjectById(projectId);
  return { title: project?.name };
}

// /projects/:project_id
export default async function ProjectNotices(props: ComponentProps) {
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
      <section className="rounded-xl border border-card/40 bg-card/40 p-4 shadow-md ring-1 ring-card/40 backdrop-blur sm:p-5">
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
              <InputGroupInput
                readOnly
                value={project.api_key}
                className="font-mono text-xs"
              />
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
      <section className="rounded-xl sm:overflow-hidden sm:border sm:border-card/40 sm:bg-card/40 sm:shadow-md sm:ring-1 sm:ring-card/40 sm:backdrop-blur">
        <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-lg border border-card/40 bg-card/40 px-4 py-3 shadow-xs sm:rounded-none sm:border-0 sm:bg-transparent sm:shadow-none sm:border-b sm:border-card/40">
          <h2 className="text-sm font-semibold text-foreground">Notices</h2>
          <div className="flex items-center gap-2">
            <EnvironmentFilter environments={uniqueEnvArray} />
            <Sort />
          </div>
        </div>

        <NoticesTable
          searchParams={resolvedSearchParams}
          projectId={project.id}
        />
      </section>
    </div>
  );
}
