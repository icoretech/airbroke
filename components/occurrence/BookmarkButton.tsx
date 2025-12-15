// components/occurrence/BookmarkButton.tsx

"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  createOccurrenceBookmark,
  removeOccurrenceBookmark,
} from "@/app/_actions";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BookmarkButtonProps {
  occurrenceId: string;
  isBookmarked: boolean;
}

export default function BookmarkButton({
  occurrenceId,
  isBookmarked,
}: BookmarkButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Store the current bookmark state locally (sync with server on refresh)
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  useEffect(() => {
    setBookmarked(isBookmarked);
  }, [isBookmarked]);

  const Icon = bookmarked ? BookmarkCheck : Bookmark;
  const label = bookmarked ? "Bookmarked" : "Bookmark";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant={bookmarked ? "secondary" : "outline"}
          size="sm"
          disabled={isPending}
          aria-disabled={isPending}
          aria-pressed={bookmarked}
          onClick={() =>
            startTransition(() => {
              const next = !bookmarked;
              setBookmarked(next);
              const action = next
                ? createOccurrenceBookmark(occurrenceId)
                : removeOccurrenceBookmark(occurrenceId);

              void action
                .catch((error) => {
                  console.error("Bookmark action failed:", error);
                  setBookmarked(!next);
                })
                .finally(() => router.refresh());
            })
          }
        >
          <Icon className="size-4" aria-hidden="true" />
          <span className="sr-only">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent sideOffset={6}>
        {bookmarked ? "Remove bookmark" : "Bookmark this occurrence"}
      </TooltipContent>
    </Tooltip>
  );
}
