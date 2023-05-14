'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { SlMagnifier } from 'react-icons/sl';

export default function Search({ currentSearchTerm }: { currentSearchTerm?: string }) {
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
  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const searchQuery = event.target.value;
    if (searchQuery === '') {
      const updatedUrl = generateUpdatedURL({ q: searchQuery });
      startTransition(() => {
        push(updatedUrl);
      });
    }
  }
  return (
    <form className="flex flex-1" onSubmit={handleSearch}>
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="relative w-full">
        <SlMagnifier
          className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-500"
          aria-hidden="true"
        />
        <input
          id="search-field"
          className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-white focus:ring-0 sm:text-sm"
          placeholder="Search..."
          type="search"
          name="searchQuery"
          autoComplete="off"
          disabled={isPending}
          autoFocus
          defaultValue={currentSearchTerm}
          onChange={handleInputChange}
        />
      </div>
    </form>
  );
}
