'use client';

import { createOccurrenceBookmark, removeOccurrenceBookmark } from '@/app/_actions';
import { useState } from 'react';
import { BsBookmarkPlus, BsBookmarkStarFill } from 'react-icons-ng/bs';

interface BookmarkButtonProps {
  occurrenceId: string;
  isBookmarked: boolean;
}

export default function BookmarkButton({ occurrenceId, isBookmarked }: BookmarkButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const serverAction = isBookmarked ? removeOccurrenceBookmark : createOccurrenceBookmark;

  const handleToggleBookmark = () => {
    serverAction(occurrenceId);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <button
      type="button"
      onClick={handleToggleBookmark}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-flex items-center gap-x-1.5 rounded-md py-2 text-sm font-semibold text-indigo-900"
    >
      {isBookmarked ? (
        <>
          {isHovered ? (
            <BsBookmarkPlus className="h-5 w-5 text-indigo-200" aria-hidden="true" />
          ) : (
            <BsBookmarkStarFill className="h-5 w-5 text-indigo-400" aria-hidden="true" />
          )}
        </>
      ) : (
        <>
          {isHovered ? (
            <BsBookmarkStarFill className="h-5 w-5 text-indigo-400" aria-hidden="true" />
          ) : (
            <BsBookmarkPlus className="h-5 w-5 text-indigo-200" aria-hidden="true" />
          )}
        </>
      )}
    </button>
  );
}
