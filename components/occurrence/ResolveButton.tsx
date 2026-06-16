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
  reinstateOccurrence,
  resolveOccurrence,
} from "@/lib/actions/occurrenceActions";

interface ResolveButtonProps {
  occurrenceId: string;
  resolvedAt: Date | null;
  iconOnly?: boolean;
}

export default function ResolveButton({
  occurrenceId,
  resolvedAt,
  iconOnly = false,
}: ResolveButtonProps) {
  const { errorMessage, isBusy, runMutation } = useClientMutation();

  const isResolved = Boolean(resolvedAt);
  const label = isResolved ? "Reinstate" : "Resolve";
  const Icon = isResolved ? RotateCcw : CheckCircle2;
  const action = isResolved ? reinstateOccurrence : resolveOccurrence;
  const toneClass = isResolved
    ? "border-rose-500/30 text-rose-200 hover:bg-rose-500/10 hover:text-rose-100"
    : "border-emerald-500/30 text-emerald-200 hover:bg-emerald-500/10 hover:text-emerald-100";

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size={iconOnly ? "icon-sm" : "sm"}
            disabled={isBusy}
            aria-disabled={isBusy}
            className={toneClass}
            onClick={() => {
              runMutation({
                action: () => action(occurrenceId),
                errorMessage: isResolved
                  ? "Could not reinstate occurrence"
                  : "Could not resolve occurrence",
              });
            }}
          >
            <Icon
              className={iconOnly ? "size-4" : "mr-2 size-4"}
              aria-hidden="true"
            />
            {iconOnly ? <span className="sr-only">{label}</span> : label}
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={6}>
          {isResolved ? "Clear resolved state" : "Mark as resolved"}
        </TooltipContent>
      </Tooltip>
      <ClientMutationError
        className="max-w-48 leading-tight"
        message={errorMessage}
      />
    </div>
  );
}
