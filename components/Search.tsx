'use client';

import { generateUpdatedURL } from '@/lib/generateUpdatedUrl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { SlDisc, SlMagnifier } from 'react-icons-ng/sl';

export default function Search() {
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { searchQuery } = Object.fromEntries(searchParams);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const q = formData.get('searchQuery') as string;
    const updatedUrl = generateUpdatedURL(pathname, searchParams, { searchQuery: q });
    startTransition(() => push(updatedUrl));
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const q = event.target.value;
    if (q === '') {
      const updatedUrl = generateUpdatedURL(pathname, searchParams, { searchQuery: q });
      startTransition(() => push(updatedUrl));
    }
  }

  return (
    <form className="flex flex-1" onSubmit={handleSearch}>
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="relative w-full">
        {isPending ? (
          <SlDisc
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 animate-spin text-gray-500"
            aria-hidden="true"
          />
        ) : (
          <SlMagnifier
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-500"
            aria-hidden="true"
          />
        )}
        <input
          id="search-field"
          className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-white focus:ring-0 sm:text-sm"
          placeholder="Search..."
          type="search"
          name="searchQuery"
          autoComplete="off"
          disabled={isPending}
          autoFocus
          defaultValue={searchQuery}
          onChange={handleInputChange}
        />
      </div>
    </form>
  );
}
