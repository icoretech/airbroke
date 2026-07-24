"use client";

import { CheckCircle2, RotateCcw } from "lucide-react";
import ClientMutationError from "@/components/common/ClientMutationError";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useClientMutation } from "@/hooks/useClientMutation";
import {
  reinstateAllOccurrences,
  resolveAllOccurrences,
} from "@/lib/actions/noticeActions";

interface ResolveNoticeButtonProps {
  noticeId: string;
  projectId: string;
  resolvedAt: Date | null;
}

export default function ResolveNoticeButton({
  noticeId,
  projectId,
  resolvedAt,
}: ResolveNoticeButtonProps) {
  const { errorMessage, isBusy, runMutation } = useClientMutation();

  const isResolved = Boolean(resolvedAt);
  const label = isResolved ? "Reinstate" : "Resolve";
  const Icon = isResolved ? RotateCcw : CheckCircle2;
  const toneClass = isResolved
    ? "border-rose-500/30 text-rose-200 hover:bg-rose-500/10 hover:text-rose-100"
    : "border-emerald-500/30 text-emerald-200 hover:bg-emerald-500/10 hover:text-emerald-100";

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              disabled={isBusy}
              aria-disabled={isBusy}
              className={toneClass}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const action = isResolved
                  ? reinstateAllOccurrences
                  : resolveAllOccurrences;
                runMutation({
                  action: () => action(noticeId, projectId),
                  errorMessage: isResolved
                    ? "Could not reinstate notice"
                    : "Could not resolve notice",
                });
              }}
            />
          }
        >
          <Icon className="size-4" aria-hidden="true" />
          <span className="sr-only">{label}</span>
        </TooltipTrigger>
        <TooltipContent sideOffset={6}>
          {isResolved ? "Reinstate all occurrences" : "Resolve all occurrences"}
        </TooltipContent>
      </Tooltip>
      <ClientMutationError
        className="max-w-48 leading-tight"
        message={errorMessage}
      />
    </div>
  );
}
