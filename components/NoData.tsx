import { SlLayers, SlPlus } from 'react-icons/sl';

export default function NoData({ message }: { message?: string }) {
  return (
    <div className="text-center">
      <SlLayers className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />

      <h3 className="mt-2 text-sm font-semibold text-white">No projects yet</h3>
      <p className="mt-1 text-sm text-gray-400">Get started by creating a new project.</p>
      <div className="mt-6">
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <SlPlus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          Create your first Project
        </button>
      </div>
    </div>
  );
}
