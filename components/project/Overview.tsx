import { deleteProject, deleteProjectNotices } from '@/app/_actions';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import NoData from '@/components/NoData';
import { Project } from '@prisma/client';

export default function Overview({ project }: { project: Project }) {
  return (
    <div className="px-4 text-white sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
        <div>
          <div className="px-4 sm:px-0">
            <h3 className="text-base font-semibold leading-7 text-white">Project Information</h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-400">Overview</p>
          </div>
          <div className="mt-6 border-t border-white/10">
            <dl className="divide-y divide-white/10">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">Name</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">{project.name}</dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">Organization</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">{project.organization}</dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">API Key</dt>
                <dd className="mt-1 font-mono text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                  {project.api_key}
                </dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">Issue Tracker</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                  {project.repo_issue_tracker ?? 'Not set'}
                </dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">Notices Count</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                  {project.notices_count.toString()}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">Created At</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                  {project.created_at.toISOString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div>
          <div className="px-4 sm:px-0">
            <h3 className="text-base font-semibold leading-7 text-white">Repository Information</h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-400">Overview</p>
          </div>
          <div className="mt-6 border-t border-white/10">
            <dl className="divide-y divide-white/10">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">Repository</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">{project.repo_url}</dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">Provider</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">{project.repo_provider}</dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">Branch</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">{project.repo_branch}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div>
          <div className="px-4 sm:px-0">
            <h3 className="text-base font-semibold leading-7 text-green-500">Test Zone</h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-400">Send test exceptions</p>
          </div>
          <NoData project={project} showHeader={false} />
        </div>

        <div>
          <div className="px-4 sm:px-0">
            <h3 className="text-base font-semibold leading-7 text-rose-500">Danger Zone</h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-400">Erase some data</p>
          </div>

          <ConfirmationDialog
            title="Delete All Errors"
            btnTitle="Delete All Errors"
            body={`Are you sure you want to delete all exceptions for the project "${project.name}"? This action cannot be undone.`}
            project={project}
            projectConfirmationAction={deleteProjectNotices}
          />

          <ConfirmationDialog
            project={project}
            projectConfirmationAction={deleteProject}
            title="Delete Project"
            btnTitle="Delete Project"
            body={`Are you sure you want to delete the project "${project.name}"? This action cannot be undone.`}
          />
        </div>
      </div>
    </div>
  );
}
