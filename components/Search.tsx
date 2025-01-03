// components/Search.tsx

'use client';

import { generateUpdatedURL } from '@/lib/generateUpdatedUrl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useTransition } from 'react';
import { SlDisc, SlMagnifier } from 'react-icons/sl';

type SearchProps = {
  /** Forcefully disable the search input */
  isDisabled?: boolean;
};

export default function Search({ isDisabled = false }: SearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Spinner/loading state from a concurrent transition
  const [isPending, startTransition] = useTransition();

  // The current search query from the URL
  const currentSearchQuery = searchParams.get('searchQuery') ?? '';

  // A ref to the input so we can re-focus after route transitions
  const inputRef = useRef<HTMLInputElement>(null);

  // A ref to store our debounce timer ID
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // After navigation completes, re-focus the input
  useEffect(() => {
    if (!isPending) {
      // queue a microtask so the new DOM is in place
      queueMicrotask(() => inputRef.current?.focus());
    }
  }, [isPending]);

  /**
   * Manual submission (Enter key). Immediately update the URL with the typed query.
   */
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newValue = formData.get('searchQuery')?.toString() ?? '';

    const updatedUrl = generateUpdatedURL(pathname, searchParams, {
      searchQuery: newValue,
    });

    startTransition(() => router.push(updatedUrl));
  }

  /**
   * On each keystroke:
   * - Clear existing debounce timer (if any)
   * - If empty, remove query param immediately
   * - Otherwise, set a 500ms debounce to auto-submit the new query
   */
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const newValue = e.target.value;
    if (newValue === '') {
      // Immediately remove searchQuery if user empties the field
      const updatedUrl = generateUpdatedURL(pathname, searchParams, {
        searchQuery: '',
      });
      startTransition(() => router.push(updatedUrl));
    } else {
      // Debounce auto-submit after 400ms
      debounceRef.current = setTimeout(() => {
        const updatedUrl = generateUpdatedURL(pathname, searchParams, {
          searchQuery: newValue,
        });
        startTransition(() => router.push(updatedUrl));
      }, 400);
    }
  }

  return (
    <form className="grid flex-1 grid-cols-1" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        id="search-field"
        name="searchQuery"
        type="search"
        placeholder="Search..."
        autoComplete="off"
        className="col-start-1 row-start-1 block size-full bg-airbroke-900 pl-8 text-base text-white outline-none placeholder:text-gray-400 sm:text-sm/6"
        defaultValue={currentSearchQuery}
        // Either user-provided isDisabled or the isPending state can disable the input
        disabled={isDisabled || isPending}
        autoFocus
        onChange={handleChange}
      />

      {isPending ? (
        <SlDisc
          className="pointer-events-none col-start-1 row-start-1 size-5 animate-spin self-center text-gray-400"
          aria-hidden="true"
        />
      ) : (
        <SlMagnifier
          className="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400"
          aria-hidden="true"
        />
      )}
    </form>
  );
}
