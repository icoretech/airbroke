// app/projects/page.tsx

import Link from "next/link";
import { TbFileAlert } from "react-icons/tb";
import AppBreadcrumbs from "@/components/AppBreadcrumbs";
import { AppShell } from "@/components/AppShell";
import CounterLabel from "@/components/CounterLabel";
import OccurrencesChartBackground from "@/components/OccurrencesChartBackground";
import PingDot from "@/components/PingDot";
import CreateProjectDialog from "@/components/project/CreateProjectDialog";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cachedProjectChartOccurrencesData } from "@/lib/actions/projectActions";
import { buildProjectsIndexCrumbs } from "@/lib/breadcrumbs";
import { getProjects } from "@/lib/queries/projects";
import type { Metadata } from "next";

type ComponentProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Projects" };
}

// /projects
export default async function Projects(props: ComponentProps) {
  const resolvedSearchParams = await props.searchParams;
  const searchQuery = resolvedSearchParams.searchQuery;
  const currentSearchTerm = typeof searchQuery === "string" ? searchQuery : "";
  // shadcn/sidebar is managed at app/projects/layout.tsx

  const projects = await getProjects(currentSearchTerm);

  const crumbs = buildProjectsIndexCrumbs();

  if (projects.length === 0) {
    if (currentSearchTerm) {
      return (
        <AppShell
          activeSection="projects"
          topbarBreadcrumbs={<AppBreadcrumbs items={crumbs} />}
        >
          <Empty className="py-10">
            <EmptyMedia variant="icon">
              <TbFileAlert className="size-8" />
            </EmptyMedia>
            <EmptyTitle>No results</EmptyTitle>
            <EmptyDescription>
              No projects match "{currentSearchTerm}". Try different keywords or
              clear the search.
            </EmptyDescription>
            <EmptyContent>
              <div className="flex items-center gap-3">
                <Button variant="outline" asChild className="w-36">
                  <Link href="/projects">Clear search</Link>
                </Button>
                <CreateProjectDialog className="w-36" />
              </div>
            </EmptyContent>
          </Empty>
        </AppShell>
      );
    }

    return (
      <AppShell
        activeSection="projects"
        topbarBreadcrumbs={<AppBreadcrumbs items={crumbs} />}
      >
        <Empty>
          <EmptyMedia variant="icon">
            <TbFileAlert className="size-8" />
          </EmptyMedia>
          <EmptyTitle>No projects</EmptyTitle>
          <EmptyDescription>
            Create your first project to start tracking errors.
          </EmptyDescription>
          <EmptyContent>
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" className="w-36">
                <Link href="/bookmarks">Bookmarks</Link>
              </Button>
              <CreateProjectDialog className="w-36" />
            </div>
          </EmptyContent>
        </Empty>
      </AppShell>
    );
  }

  const projectsWithChartData = await Promise.all(
    projects.map(async (project) => {
      const chartData = await cachedProjectChartOccurrencesData(project.id);
      return { ...project, chartData };
    }),
  );

  return (
    <AppShell
      activeSection="projects"
      topbarBreadcrumbs={<AppBreadcrumbs items={crumbs} />}
    >
      <ul className="divide-y divide-white/5">
        {projectsWithChartData.map((project) => {
          // Decide color class
          const isEmpty = project.notices_count === BigInt(0);
          const colorKey = project.paused ? "gray" : isEmpty ? "green" : "red";
          const badgeLabel = `${project.organization} / ${project.name}`;

          return (
            <li key={project.id} className="relative hover:bg-airbroke-800">
              {/* Chart as background */}
              <div className="pointer-events-none absolute inset-0 z-0">
                <OccurrencesChartBackground chartData={project.chartData} />
              </div>

              <Link
                href={`/projects/${project.id}`}
                className="relative z-10 block p-4 sm:px-6 lg:px-8"
              >
                <div className="flex items-center justify-between">
                  <span className="relative z-10 inline-flex items-center gap-1.5 rounded-md bg-gray-900/70 px-2 py-1 text-xs font-medium text-white">
                    {/* Dot with ping animation */}
                    <PingDot color={colorKey} />
                    {badgeLabel}
                  </span>

                  {/* Right side: CounterLabel */}
                  <div className="relative z-10">
                    <CounterLabel counter={project.notices_count} />
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
