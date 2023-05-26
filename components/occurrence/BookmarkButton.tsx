'use client';

import { useEffect, useState } from 'react';

interface BookmarkButtonProps {
  projectId: string;
  noticeId: string;
  occurrenceId: string;
}

export default function BookmarkButton({ projectId, noticeId, occurrenceId }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  useEffect(() => {
    const storedBookmarks = localStorage.getItem('bookmarks');
    if (storedBookmarks) {
      const bookmarks = JSON.parse(storedBookmarks, (key, value) =>
        key === '' ? value : typeof value === 'string' ? BigInt(value) : value
      );
      setIsBookmarked(
        bookmarks.some((bookmark: any) => {
          return (
            bookmark.projectId === projectId && bookmark.noticeId === noticeId && bookmark.occurrenceId === occurrenceId
          );
        })
      );
    }
  }, [projectId, noticeId, occurrenceId]);

  const handleBookmark = () => {
    const storedBookmarks = localStorage.getItem('bookmarks');
    let bookmarks = [];
    if (storedBookmarks) {
      bookmarks = JSON.parse(storedBookmarks, (key, value) =>
        key === '' ? value : typeof value === 'string' ? BigInt(value) : value
      );
    }

    const bookmarkId = {
      projectId: String(projectId),
      noticeId: String(noticeId),
      occurrenceId: String(occurrenceId),
    };

    const bookmarkIndex = bookmarks.findIndex((bookmark: any) => {
      return (
        bookmark.projectId === projectId && bookmark.noticeId === noticeId && bookmark.occurrenceId === occurrenceId
      );
    });

    if (bookmarkIndex !== -1) {
      bookmarks.splice(bookmarkIndex, 1);
    } else {
      bookmarks.push(bookmarkId);
    }

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    setIsBookmarked(!isBookmarked);
  };

  return (
    <button
      type="button"
      onClick={handleBookmark}
      className={`inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold ${
        isBookmarked ? 'bg-indigo-900 text-white' : 'bg-indigo-200 text-indigo-900'
      } hover:bg-indigo-800 hover:text-white`}
    >
      {isBookmarked ? 'Bookmarked' : 'Bookmark'}
    </button>
  );
}
