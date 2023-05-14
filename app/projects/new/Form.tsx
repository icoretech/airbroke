'use client';

import { createProject } from '@/app/_actions';
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
      startTransition(() => {
        router.push(`/projects/${project_id}`);
      });
    }
  }

  return (
    <form action={handleSubmit}>
      {error && (
        <div className="relative mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className="space-y-12">
        <div className="border-b border-white/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-white">Project Info</h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            This information will be displayed publicly so be careful what you share.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="organization" className="block text-sm font-medium leading-6 text-white">
                Organization
              </label>
              <div className="mt-2">
                <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">github.com/</span>
                  <input
                    type="text"
                    name="organization"
                    id="organization"
                    autoComplete="off"
                    className="flex-1 border-0 bg-transparent py-1.5 pl-1 text-white focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="myorganization"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-white">
                Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">workcation.com/</span>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="off"
                    className="flex-1 border-0 bg-transparent py-1.5 pl-1 text-white focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-white">
          Cancel
        </button>
        <AddButton />
      </div>
    </form>
  );
}
