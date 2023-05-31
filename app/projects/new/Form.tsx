'use client';

import { createProject } from '@/app/_actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';
import AddButton from './AddButton';

export default function Form() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // TODO: wire createProject instead of handleSubmit when server
  // actions will have form status api. this will also make
  // the disabled button work.
  // https://twitter.com/dan_abramov/status/1654336219919048704
  // https://twitter.com/dan_abramov/status/1655667749887025161
  // https://twitter.com/dan_abramov/status/1654482455267536896
  // https://github.com/vercel/next.js/discussions/49426#discussioncomment-5860713
  // https://twitter.com/dan_abramov/status/1655536195558862849
  async function handleSubmit(formData: FormData) {
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    const { project_id, error } = await createProject(formData);
    if (error) {
      setError(error);
    } else {
      setError(null);
      startTransition(() => router.push(`/projects/${project_id}`));
    }
  }

  async function handleSubmitNoRepo() {
    // Handle form submission when the user doesn't have a repo yet
    const { project_id, error } = await createProject();
    if (error) {
      setError(error);
    } else {
      setError(null);
      startTransition(() => router.push(`/projects/${project_id}`));
    }
  }

  return (
    <form action={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-white/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-white">Get Started Instantly</h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Start right away by providing your repository URL. No HTTP requests will be made to your git provider during
            this process.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-white">
                Repository URL
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  name="repository_url"
                  id="repository_url"
                  autoComplete="off"
                  className={`block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 ${
                    error ? 'border border-rose-500' : ''
                  }`}
                  placeholder="e.g., https://github.com/icoretech/airbroke"
                />
                {error && (
                  <div className="mt-2 text-sm text-rose-500">
                    <strong className="font-bold">Error: </strong>
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-2">
            <span className="text-xs text-gray-400">or</span>
            <button
              id="no_repo"
              name="no_repo"
              formAction={handleSubmitNoRepo}
              className="rounded border-gray-300 text-xs text-indigo-200 hover:text-indigo-400 focus:ring-indigo-200"
            >
              Create a project without a repository
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end space-x-6">
        <Link href="/" className="text-sm font-semibold leading-6 text-white">
          Cancel
        </Link>

        <AddButton />
      </div>
    </form>
  );
}
