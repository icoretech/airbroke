import NoData from '@/components/NoData';
import { getNoticeIdsByProjectId } from '@/lib/queries/notices';
import { getHourlyOccurrenceRateForLast14Days, getOccurrenceIdsByNoticeIds } from '@/lib/queries/occurrences';
import { getProjectById } from '@/lib/queries/projects';
import ConfirmationDialog from '../ConfirmationDialog';
import OccurrencesChartWrapper from './OccurrencesChartWrapper';

type OverviewProps = {
  projectId: string;
};

async function Overview({ projectId }: OverviewProps) {
  const project = await getProjectById(projectId);
  if (!project) {
    throw new Error('Project not found');
  }
  const noticeIds = await getNoticeIdsByProjectId(project.id);
  const occurrenceIds = await getOccurrenceIdsByNoticeIds(noticeIds);
  const hourlyOccurrenceRateForLast14Days = await getHourlyOccurrenceRateForLast14Days(project.id);

  const stats = [
    { name: 'Notices', value: noticeIds.length },
    { name: 'Occurrences', value: occurrenceIds.length },
    { name: 'Incoming Rate', value: hourlyOccurrenceRateForLast14Days, unit: '/ hour' },
  ];

  return (
    <div className="px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4">
        <div className="rounded-lg bg-gray-900 p-6">
          <h3 className="text-base font-semibold leading-6 text-white">Project Information</h3>
          <p className="mt-1 text-sm leading-6 text-gray-400">Overview</p>
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
          </dl>
        </div>
        <div className="rounded-lg bg-gray-900 p-6">
          <h3 className="text-base font-semibold leading-6 text-white">Repository Information</h3>
          <p className="mt-1 text-sm leading-6 text-gray-400">Overview</p>
          <dl className="mt-6 divide-y divide-white/10">
            <div className="py-3">
              <dt className="text-sm font-medium leading-6 text-white">URL</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-400">{project.repo_url || 'Not set'}</dd>
            </div>
            <div className="py-3">
              <dt className="text-sm font-medium leading-6 text-white">Provider</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-400">{project.repo_provider}</dd>
            </div>
            <div className="py-3">
              <dt className="text-sm font-medium leading-6 text-white">Main Branch</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-400">{project.repo_branch}</dd>
            </div>
            <div className="py-3">
              <dt className="text-sm font-medium leading-6 text-white">Issue Tracker</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-400">{project.repo_issue_tracker || 'Not set'}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg bg-gray-900 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold leading-6 text-white">Stats</h3>
            <div className="text-sm text-gray-400">Last 24 hours</div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6">
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-1">
          <div className="rounded-lg bg-gray-900 p-6">
            <div className="flex h-full flex-col">
              <div>
                <h3 className="text-base font-semibold leading-6 text-green-500">Test Zone</h3>
              </div>
              <div className="mt-6 flex-1">
                <NoData project={project} showHeader={false} />
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-gray-900 p-6">
            <h3 className="text-base font-semibold leading-6 text-rose-500">Danger Zone</h3>
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 justify-items-center gap-4">
                <ConfirmationDialog
                  project={project}
                  title="Delete All Errors"
                  body={`Are you sure you want to delete all exceptions for the project "${project.name}"? This action cannot be undone.`}
                  btnId="deleteAllErrors"
                />

                <ConfirmationDialog
                  project={project}
                  title="Delete Project"
                  body={`Are you sure you want to delete the project "${project.name}"? This action cannot be undone.`}
                  btnId="deleteProject"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-gray-900 p-6">
        <OccurrencesChartWrapper occurrenceIds={occurrenceIds} />
      </div>
    </div>
  );
}

export default Overview as unknown as (props: OverviewProps) => JSX.Element;
