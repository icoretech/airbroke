// components/project/Overview.tsx

import { getNoticesCountByProjectId } from '@/lib/queries/notices';
import { getHourlyOccurrenceRateForLast14Days, getOccurrencesCountByProjectId } from '@/lib/queries/occurrences';
import TestZone from '../TestZone';
import OccurrencesChartWrapper from './OccurrencesChartWrapper';
import DangerZone from './cards/DangerZone';

import type { Project } from '@prisma/client';

export default async function Overview({ project }: { project: Project }) {
  const [noticesCount, occurrencesCount, hourlyOccurrenceRateForLast14Days] = await Promise.all([
    getNoticesCountByProjectId(project.id),
    getOccurrencesCountByProjectId(project.id),
    getHourlyOccurrenceRateForLast14Days(project.id),
  ]);

  const stats = [
    { name: 'Notices', value: noticesCount },
    { name: 'Occurrences', value: occurrencesCount },
    { name: 'Incoming Rate', value: hourlyOccurrenceRateForLast14Days, unit: '/ hour' },
  ];

  return (
    <div className="space-y-6 px-4 py-6 text-white sm:px-6 lg:px-8">
      {/* Stats block, full width */}
      <div className="rounded-lg bg-gray-900 p-6 shadow-md">
        <h3 className="text-base font-semibold leading-6 text-white">Stats</h3>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.name} className="rounded-lg bg-gray-800 p-4">
              <p className="text-sm font-medium leading-6 text-gray-400">{stat.name}</p>
              <p className="mt-2 flex items-baseline gap-x-2">
                <span className="text-4xl font-semibold tracking-tight text-white">{stat.value}</span>
                {stat.unit && <span className="text-sm text-gray-400">{stat.unit}</span>}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chart goes first, full width */}
      <div className="rounded-lg bg-gray-900 p-6 shadow-md">
        <OccurrencesChartWrapper projectId={project.id} />
      </div>

      {/* Two-column layout for Project Info + Repository Info */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Project info */}
        <div className="rounded-lg bg-gray-900 p-6 shadow-md">
          <h3 className="text-base font-semibold leading-6 text-white">Project Information</h3>
          <dl className="mt-6 divide-y divide-white/10">
            <div className="py-3">
              <dt className="text-sm font-medium leading-6 text-white">Name</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-400">{project.name}</dd>
            </div>
            <div className="py-3">
              <dt className="text-sm font-medium leading-6 text-white">Organization</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-400">{project.organization}</dd>
            </div>
            <div className="py-3">
              <dt className="text-sm font-medium leading-6 text-white">API Key</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-400">{project.api_key}</dd>
            </div>
            <div className="py-3">
              <dt className="text-sm font-medium leading-6 text-white">Status</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-400">{project.paused ? 'Paused' : 'Accepting data'}</dd>
            </div>
          </dl>
        </div>

        {/* Repository info */}
        <div className="rounded-lg bg-gray-900 p-6 shadow-md">
          <h3 className="text-base font-semibold leading-6 text-white">Repository Information</h3>
          <dl className="mt-6 divide-y divide-white/10">
            <div className="py-3">
              <dt className="text-sm font-medium leading-6 text-white">Provider</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-400">{project.repo_provider}</dd>
            </div>
            <div className="py-3">
              <dt className="text-sm font-medium leading-6 text-white">URL</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-400">{project.repo_url || 'Not set'}</dd>
            </div>
            <div className="py-3">
              <dt className="text-sm font-medium leading-6 text-white">Main Branch</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-400">{project.repo_branch || 'Not set'}</dd>
            </div>
            <div className="py-3">
              <dt className="text-sm font-medium leading-6 text-white">Issue Tracker</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-400">{project.repo_issue_tracker || 'Not set'}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* "Actions" area with Test Zone + Danger Zone, full width */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Test Zone */}
        <div className="rounded-lg bg-gray-900 p-6 shadow-md">
          <TestZone project={project} />
        </div>

        {/* Right: Danger Zone */}
        <div className="rounded-lg bg-gray-900 p-6 shadow-md">
          <DangerZone project={project} />
        </div>
      </div>
    </div>
  );
}
