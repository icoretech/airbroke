// components/project/CreateForm.tsx

'use client';

import { createProject, ProjectState } from '@/lib/actions/projectActions';
import clsx from 'clsx';
import Link from 'next/link';
import { useActionState } from 'react';
import { SlDisc } from 'react-icons/sl';

// Our initial state shape
const initialState: ProjectState = {
  error: null,
  lastUrl: '',
};

export default function CreateForm() {
  const [{ error, lastUrl }, formAction, pending] = useActionState(createProject, initialState);

  return (
    <form action={formAction}>
      <div className="space-y-12">
        <div className="border-b border-white/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-white">Get Started Instantly</h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Provide your repository URL. No requests will be made to your source code provider.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label htmlFor="repository_url" className="block text-sm font-medium leading-6 text-white">
                Repository URL
              </label>

              <div className="relative mt-2">
                <input
                  type="text"
                  name="repository_url"
                  id="repository_url"
                  autoComplete="off"
                  defaultValue={lastUrl}
                  disabled={pending}
                  placeholder="https://github.com/icoretech/airbroke"
                  className={clsx(
                    'block w-full rounded-md bg-white/5 px-3.5 py-2 text-white shadow-sm',
                    error
                      ? 'border border-rose-500 ring-1 ring-rose-500 focus:ring-rose-500'
                      : 'border border-transparent ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500',
                    'sm:text-sm sm:leading-6'
                  )}
                />

                {error && <div className="mt-2 text-sm text-rose-500">{error}</div>}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-2">
            <span className="text-sm text-gray-400">or</span>
            <button
              type="submit"
              name="repository_url"
              disabled={pending}
              value=""
              className="rounded border-gray-300 text-sm text-indigo-200 hover:text-indigo-400 focus:ring-indigo-200"
            >
              Create a project without a repository
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end space-x-6">
        <Link href="/projects" className="text-sm font-semibold leading-6 text-white">
          Cancel
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-indigo-200 shadow-sm hover:bg-indigo-600 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
        >
          {pending && <SlDisc className="-ml-0.5 h-5 w-5 animate-spin" aria-hidden="true" />}
          <span>{pending ? 'Saving...' : 'Create'}</span>
        </button>
      </div>
    </form>
  );
}
