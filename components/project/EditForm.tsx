// components/project/EditForm.tsx

'use client';

import { ProjectResponse, updateProject } from '@/lib/actions/projectActions';
import type { Project } from '@prisma/client';
import clsx from 'clsx';
import { useActionState } from 'react';
import { SlDisc, SlFire } from 'react-icons/sl';

const initialState: ProjectResponse = {};

export default function EditForm({ project }: { project: Project }) {
  const [state, formAction, pending] = useActionState(updateProject, initialState);

  return (
    <form action={formAction} className="px-4 py-6 text-white sm:px-6 lg:px-8">
      {/* Card container */}
      <div className="overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-semibold leading-7 text-white">Edit Project Settings</h2>
          <p className="mt-1 text-sm leading-5 text-gray-300">
            Update your project&rsquo;s metadata or repository details. When finished, click &ldquo;Save&rdquo; to apply
            changes.
          </p>
        </div>

        {/* Error display (if any) */}
        {state.error && (
          <div className="border-t border-white/10 bg-rose-800 px-4 py-4 sm:px-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <SlFire className="h-5 w-5 text-red-200" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-white">Submission Error</h3>
                <div className="mt-2 text-sm text-red-200">{state.error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Hidden field for the projectId */}
        <input type="hidden" name="projectId" value={project.id} />

        {/* Form fields */}
        <div className="space-y-6 border-t border-white/10 px-4 py-5 sm:p-6">
          {/* Row 1: Organization & Name */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
            {/* Organization */}
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
                  placeholder={project.organization}
                  defaultValue={project.organization}
                  className={clsx(
                    'block w-full rounded-md bg-white/5 px-3.5 py-2 text-white shadow-sm',
                    'ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6'
                  )}
                />
                {state.errors?.organization && (
                  <div className="mt-2 text-sm text-rose-500">{state.errors.organization[0]}</div>
                )}
              </div>
            </div>

            {/* Name */}
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
                  defaultValue={project.name}
                  className={clsx(
                    'block w-full rounded-md bg-white/5 px-3.5 py-2 text-white shadow-sm',
                    state?.errors?.name
                      ? 'border border-rose-500 ring-1 ring-rose-500 focus:ring-rose-500'
                      : 'ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500',
                    'sm:text-sm sm:leading-6'
                  )}
                />
                {state.errors?.name && <div className="mt-2 text-sm text-rose-500">{state.errors.name[0]}</div>}
              </div>
            </div>
          </div>

          {/* Row 2: repository fields */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
            {/* repo_url */}
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
                  defaultValue={project.repo_url ?? ''}
                  placeholder="https://github.com/icoretech/airbroke"
                  className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
                {state.errors?.repo_url && <div className="mt-2 text-sm text-rose-500">{state.errors.repo_url[0]}</div>}
              </div>
            </div>

            {/* repo_branch */}
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
                  defaultValue={project.repo_branch ?? ''}
                  placeholder="main"
                  className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
                {state.errors?.repo_branch && (
                  <div className="mt-2 text-sm text-rose-500">{state.errors.repo_branch[0]}</div>
                )}
              </div>
            </div>

            {/* repo_issue_tracker */}
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
                  defaultValue={project.repo_issue_tracker ?? ''}
                  placeholder="https://github.com/icoretech/airbroke/issues"
                  className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
                {state.errors?.repo_issue_tracker && (
                  <div className="mt-2 text-sm text-rose-500">{state.errors.repo_issue_tracker[0]}</div>
                )}
              </div>
            </div>
          </div>

          {/* Additional note or help text */}
          <div className="rounded-md bg-airbroke-600 p-4 text-xs text-gray-300">
            <p>
              <strong>Tip:</strong> If you&rsquo;re using GitHub or another provider, be sure to update{' '}
              <code>repo_url</code> and <code>repo_issue_tracker</code>
              to direct your backtrace links or issue references to the correct location.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="border-t border-white/10 px-4 py-3 text-right sm:px-6">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-indigo-200 shadow-sm hover:bg-indigo-600 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          >
            {pending && <SlDisc className="-ml-0.5 h-5 w-5 animate-spin" aria-hidden="true" />}
            <span>{pending ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
