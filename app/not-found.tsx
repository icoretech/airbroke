// app/not-found.tsx

import Link from 'next/link';
import { TbFileXFilled } from 'react-icons/tb';

export default function NotFound() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-airbroke-900 px-6 py-24 text-white sm:py-32">
      <div className="flex flex-col items-center text-center">
        <TbFileXFilled className="mb-4 h-12 w-12 text-gray-500" />

        <h1 className="mb-2 text-6xl font-bold tracking-tight text-white sm:text-7xl">404</h1>
        <p className="text-xl font-semibold text-gray-300">Page Not Found</p>
        <p className="mt-4 max-w-md text-sm text-gray-400">
          Oops! We couldn’t find the page you’re looking for. It might have been removed or you may have typed the wrong
          URL.
        </p>

        <Link
          href="/projects"
          className="mt-8 inline-block rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-indigo-600 ring-offset-2 transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Back to Projects
        </Link>
      </div>
    </main>
  );
}
