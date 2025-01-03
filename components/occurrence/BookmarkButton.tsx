// components/occurrence/BookmarkButton.tsx

'use client';

import { createOccurrenceBookmark, removeOccurrenceBookmark } from '@/app/_actions';
import { Transition } from '@headlessui/react';
import { useRef, useState } from 'react';
import { MdCancel, MdPlaylistAddCheckCircle } from 'react-icons/md';
import { TbBookmark, TbBookmarkFilled } from 'react-icons/tb';

interface BookmarkButtonProps {
  occurrenceId: string;
  isBookmarked: boolean;
}

export default function BookmarkButton({ occurrenceId, isBookmarked }: BookmarkButtonProps) {
  // Store the current bookmark state locally
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  // Hover state for icon swap
  const [isHovered, setIsHovered] = useState(false);

  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastDetail, setToastDetail] = useState<string | null>(null);

  // We'll keep a ref to the timerId so we can clear it if another action happens quickly
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleToggleBookmark = async () => {
    try {
      // Decide action based on local `bookmarked`
      if (bookmarked) {
        await removeOccurrenceBookmark(occurrenceId);
        setToastMessage('Bookmark removed!');
        setToastDetail('The bookmark was removed.');
      } else {
        await createOccurrenceBookmark(occurrenceId);
        setToastMessage('Bookmarked successfully!');
        setToastDetail('The occurrence is now bookmarked.');
      }

      // Flip local state
      setBookmarked(!bookmarked);

      // If a toast is currently active, clear its timer so it won't hide too soon
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }

      // Show the toast again
      setToastVisible(true);

      // Start a fresh timer to hide the toast after 2.5 seconds
      hideTimerRef.current = setTimeout(() => {
        setToastVisible(false);
      }, 2500);
    } catch (error) {
      console.error('Bookmark action failed:', error);
      // Optionally show an error toast here
    }
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Decide which bookmark icon to show
  const Icon = bookmarked
    ? isHovered
      ? TbBookmark // hovered => outline
      : TbBookmarkFilled // normal => filled
    : isHovered
      ? TbBookmarkFilled
      : TbBookmark;

  const iconColor = bookmarked
    ? isHovered
      ? 'text-indigo-200'
      : 'text-indigo-400'
    : isHovered
      ? 'text-indigo-400'
      : 'text-indigo-200';

  return (
    <>
      {/* Bookmark button */}
      <button
        type="button"
        onClick={handleToggleBookmark}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-flex items-center gap-x-1.5 rounded-md py-2 text-sm font-semibold text-indigo-900"
      >
        <Icon className={`h-5 w-5 ${iconColor}`} aria-hidden="true" />
      </button>

      {/* Toast container */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 z-50 flex items-end justify-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-end space-y-4 sm:items-end">
          <Transition
            show={toastVisible}
            as="div"
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0 sm:translate-x-0"
            leaveTo="opacity-0 translate-y-2 sm:translate-y-0 sm:translate-x-2"
          >
            {toastMessage && (
              <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5 sm:max-w-sm">
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <MdPlaylistAddCheckCircle className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div className="ml-3 flex-1 pt-0.5">
                      <p className="text-sm font-medium text-gray-900">{toastMessage}</p>
                      {toastDetail && <p className="mt-1 text-sm text-gray-500">{toastDetail}</p>}
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setToastVisible(false)}
                        className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        <span className="sr-only">Close</span>
                        <MdCancel className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Transition>
        </div>
      </div>
    </>
  );
}
