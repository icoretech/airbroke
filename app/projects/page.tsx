// app/projects/page.tsx

import CounterLabel from '@/components/CounterLabel';
import CreateProjectProposal from '@/components/CreateProjectProposal';
import { DashboardShell } from '@/components/DashboardShell';
import OccurrencesChartBackground from '@/components/OccurrencesChartBackground';
import PingDot from '@/components/PingDot';
import { cachedProjectChartOccurrencesData } from '@/lib/actions/projectActions';
import { getProjects } from '@/lib/queries/projects';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { TbFileAlert } from 'react-icons/tb';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export async function generateMetadata() {
  return { title: 'Projects' };
}

// /projects
export default async function Projects(props: { searchParams: SearchParams }) {
  const resolvedSearchParams = await props.searchParams;
  const searchQuery = resolvedSearchParams.searchQuery;
  const currentSearchTerm = typeof searchQuery === 'string' ? searchQuery : '';
  const cookieStore = await cookies();
  const initialSidebarOpen = cookieStore.get('sidebarOpen')?.value === 'true';

  const projects = await getProjects(currentSearchTerm);

  if (projects.length === 0) {
    return (
      <DashboardShell initialSidebarOpen={initialSidebarOpen}>
        {currentSearchTerm ? (
          <div className="mt-10 text-center">
            <TbFileAlert aria-hidden="true" className="mx-auto h-12 w-12 animate-bounce text-indigo-200" />
            <h3 className="mt-2 text-sm font-semibold text-indigo-200">No projects found for {currentSearchTerm}</h3>
            <CreateProjectProposal />
          </div>
        ) : (
          <CreateProjectProposal />
        )}
      </DashboardShell>
    );
  }

  const projectsWithChartData = await Promise.all(
    projects.map(async (project) => {
      const chartData = await cachedProjectChartOccurrencesData(project.id);
      return { ...project, chartData };
    })
  );

  return (
    <DashboardShell initialSidebarOpen={initialSidebarOpen}>
      <ul role="list" className="divide-y divide-white/5">
        {projectsWithChartData.map((project) => {
          // Decide color class
          const isEmpty = project.notices_count === BigInt(0);
          const colorKey = project.paused ? 'gray' : isEmpty ? 'green' : 'red';
          const badgeLabel = `${project.organization} / ${project.name}`;

          return (
            <li key={project.id} className="relative hover:bg-airbroke-800">
              {/* Chart as background */}
              <div className="pointer-events-none absolute inset-0 z-0">
                <OccurrencesChartBackground chartData={project.chartData} />
              </div>

              <Link href={`/projects/${project.id}`} className="relative z-10 block p-4 sm:px-6 lg:px-8">
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
    </DashboardShell>
  );
}
