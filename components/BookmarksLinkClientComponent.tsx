'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BsBookmarksFill } from 'react-icons-ng/bs';

export default function BookmarksLinkClientComponent() {
  const pathname = usePathname();
  const isActive = pathname === '/bookmarks';

  return (
    <Link
      href="/bookmarks"
      className={`group flex transform gap-x-3 rounded-md p-2 text-sm leading-6 text-gray-400 transition-all duration-100 ease-out will-change-transform hover:scale-105 ${
        isActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'
      }`}
    >
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-x-3 font-semibold">
          <BsBookmarksFill className="h-6 w-6 shrink-0" aria-hidden="true" />
          <span>Bookmarks</span>
        </div>
      </div>
    </Link>
  );
}
