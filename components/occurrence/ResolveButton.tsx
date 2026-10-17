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

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant={iconOnly || isResolved ? "outline" : "default"}
              size={iconOnly ? "icon-sm" : "lg"}
              disabled={isBusy}
              aria-disabled={isBusy}
              onClick={() => {
                runMutation({
                  action: () => action(occurrenceId),
                  errorMessage: isResolved
                    ? "Could not reinstate occurrence"
                    : "Could not resolve occurrence",
                });
              }}
            />
          }
        >
          <Icon
            data-icon={iconOnly ? undefined : "inline-start"}
            aria-hidden="true"
          />
          {iconOnly ? <span className="sr-only">{label}</span> : label}
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
