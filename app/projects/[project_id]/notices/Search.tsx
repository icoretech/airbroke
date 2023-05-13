'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export default function Search() {
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function generateUpdatedURL(paramsToUpdate: Record<string, string>) {
    const updatedParams = new URLSearchParams(searchParams.toString());

    for (const key in paramsToUpdate) {
      updatedParams.set(key, paramsToUpdate[key]);
    }
    return `${pathname}?${updatedParams.toString()}`;
  }

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchQuery = formData.get('searchQuery') as string;
    const updatedUrl = generateUpdatedURL({ q: searchQuery });
    startTransition(() => {
      push(updatedUrl);
    });
  }

  return (
    <form className="flex flex-1" onSubmit={handleSearch}>
      <label htmlFor="search" className="sr-only">
        Search Project
      </label>
      <div className="relative flex items-center">
        <input
          id="search-field"
          className="block h-8 w-full rounded-md border-0 bg-gray-700 py-0 pr-14 text-white shadow-sm ring-0 ring-inset placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          placeholder="Search..."
          type="search"
          name="searchQuery"
          autoComplete="off"
          disabled={isPending}
          autoFocus
        />
      </div>
    </form>
  );
}
