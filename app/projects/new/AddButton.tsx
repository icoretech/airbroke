'use client';

import { experimental_useFormStatus as useFormStatus } from 'react-dom';
import { SlDisc } from 'react-icons/sl';

export default function AddButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400"
    >
      {pending && <SlDisc className="-ml-0.5 h-5 w-5 animate-spin" aria-hidden="true" />}
      <span>{pending ? 'Saving...' : 'Save'}</span>
    </button>
  );
}
