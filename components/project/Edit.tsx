import { updateProject } from '@/lib/actions';
import { getProjectById } from '@/lib/queries/projects';
import { redirect } from 'next/navigation';
import { SlFire } from 'react-icons/sl';

type EditProps = {
  projectId: string;
  currentErrorMessage: string | null;
};

export default async function Edit({ projectId, currentErrorMessage }: EditProps) {
  const project = await getProjectById(projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  async function handleForm(formData: FormData) {
    'use server';
    const { error } = await updateProject(projectId, formData);

    const errorParam = error ? `&errorMessage=${error}` : '';
    redirect(`/projects/${projectId}/edit?tab=edit${errorParam}`);
  }

  return (
    <div className="px-4 py-6 text-white sm:px-6 lg:px-8">
      <form action={handleForm}>
        <div className="space-y-12">
          <h2 className="text-base font-semibold leading-7 text-white">Project Information</h2>
          {currentErrorMessage && (
            <div className="mb-4 rounded-md bg-rose-800 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <SlFire className="h-5 w-5 text-red-200" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-white">There was an error with your submission</h3>
                  <div className="mt-2 text-sm text-red-200">
                    <ul role="list" className="list-disc space-y-1 pl-5">
                      <li>{currentErrorMessage}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="organization" className="block text-sm font-medium leading-6 text-white">
                Organization
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="organization"
                  id="organization"
                  autoComplete="off"
                  defaultValue={project?.organization || ''}
                  placeholder="iCoreTech"
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-white">
                Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="off"
                  defaultValue={project?.name || ''}
                  placeholder="MyProject"
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label htmlFor="repo_url" className="block text-sm font-medium leading-6 text-white">
                Repository URL
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="repo_url"
                  id="repo_url"
                  autoComplete="off"
                  defaultValue={project?.repo_url || ''}
                  placeholder="https://github.com/icoretech/airbroke"
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="repo_branch" className="block text-sm font-medium leading-6 text-white">
                Repository Branch
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="repo_branch"
                  id="repo_branch"
                  autoComplete="off"
                  placeholder="main"
                  defaultValue={project?.repo_branch || ''}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="repo_issue_tracker" className="block text-sm font-medium leading-6 text-white">
                Repository Issue Tracker
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="repo_issue_tracker"
                  id="repo_issue_tracker"
                  autoComplete="off"
                  placeholder="https://github.com/icoretech/projects/issues"
                  defaultValue={project?.repo_issue_tracker || ''}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-indigo-200 shadow-sm hover:bg-indigo-600 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
              type="submit"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
