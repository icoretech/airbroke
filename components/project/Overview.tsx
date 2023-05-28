import ConfirmationDialog from '@/components/ConfirmationDialog';
import NoData from '@/components/NoData';
import { getNoticeIdsByProjectId } from '@/lib/queries/notices';
import { getOccurrenceIdsByNoticeIds } from '@/lib/queries/occurrences';
import { getProjectById } from '@/lib/queries/projects';
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
  const stats = [
    { name: 'Notices', value: noticeIds.length },
    { name: 'Occurrences', value: occurrenceIds.length, unit: 'mins' },
    { name: 'Number of servers', value: '3' },
  ];

  return (
    <div className="px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
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
            {/* Other project information */}
          </dl>
        </div>

        <div className="rounded-lg bg-gray-900 p-6">
          <h3 className="text-base font-semibold leading-6 text-white">Repository Information</h3>
          <p className="mt-1 text-sm leading-6 text-gray-400">Overview</p>
          <dl className="mt-6 divide-y divide-white/10">
            <div className="py-3">
              <dt className="text-sm font-medium leading-6 text-white">Repository</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-400">{project.repo_url}</dd>
            </div>
            <div className="py-3">
              <dt className="text-sm font-medium leading-6 text-white">Provider</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-400">{project.repo_provider}</dd>
            </div>
            {/* Other repository information */}
          </dl>
        </div>

        <div className="rounded-lg bg-gray-900 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold leading-6 text-white">Stats</h3>
            <div className="text-sm text-gray-400">Last 24 hours</div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
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

        <div className="rounded-lg bg-gray-900 p-6">
          <h3 className="text-base font-semibold leading-6 text-green-500">Test Zone</h3>
          <p className="mt-1 text-sm leading-6 text-gray-400">Send test exceptions</p>
          <div className="mt-6">
            <NoData project={project} showHeader={false} />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-gray-900 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold leading-6 text-rose-500">Danger Zone</h3>
          <div className="text-sm text-gray-400">Handle with care</div>
        </div>
        <div className="mt-6 space-y-4">
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

      <div className="mt-6 rounded-lg bg-gray-900 p-6">
        <h3 className="text-base font-semibold leading-6 text-white">Hourly Occurrences in the past 14 days</h3>
        <p className="mt-1 text-sm leading-6 text-gray-400">Overview of occurrences</p>
        <div className="mt-6">
          <OccurrencesChartWrapper occurrenceIds={occurrenceIds} />
        </div>
      </div>
    </div>
  );
}

export default Overview as unknown as (props: OverviewProps) => JSX.Element;
