"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useState } from "react";
import ClientMutationError from "@/components/common/ClientMutationError";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useClientMutation } from "@/hooks/useClientMutation";
import {
  createOccurrenceBookmark,
  removeOccurrenceBookmark,
} from "@/lib/actions/occurrenceActions";

interface BookmarkButtonProps {
  occurrenceId: string;
  isBookmarked: boolean;
}

export default function BookmarkButton({
  occurrenceId,
  isBookmarked,
}: BookmarkButtonProps) {
  const { errorMessage, isBusy, runMutation } = useClientMutation();
  const [optimistic, setOptimistic] = useState<{
    occurrenceId: string;
    bookmarked: boolean;
  } | null>(null);

  const bookmarked =
    optimistic?.occurrenceId === occurrenceId &&
    optimistic.bookmarked !== isBookmarked
      ? optimistic.bookmarked
      : isBookmarked;

  const Icon = bookmarked ? BookmarkCheck : Bookmark;
  const label = bookmarked ? "Bookmarked" : "Bookmark";

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant={bookmarked ? "secondary" : "outline"}
              size="icon-sm"
              disabled={isBusy}
              aria-disabled={isBusy}
              aria-pressed={bookmarked}
              onClick={() => {
                const next = !bookmarked;
                setOptimistic({ occurrenceId, bookmarked: next });
                runMutation({
                  action: () =>
                    next
                      ? createOccurrenceBookmark(occurrenceId)
                      : removeOccurrenceBookmark(occurrenceId),
                  errorMessage: next
                    ? "Could not bookmark occurrence"
                    : "Could not remove bookmark",
                  onFailure: () => setOptimistic(null),
                });
              }}
            />
          }
        >
          <Icon className="size-4" aria-hidden="true" />
          <span className="sr-only">{label}</span>
        </TooltipTrigger>
        <TooltipContent sideOffset={6}>
          {bookmarked ? "Remove bookmark" : "Bookmark this occurrence"}
        </TooltipContent>
      </Tooltip>
      <ClientMutationError
        className="max-w-48 leading-tight"
        message={errorMessage}
      />
    </div>
  );
}
