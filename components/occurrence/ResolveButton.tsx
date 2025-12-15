// components/occurrence/ResolveButton.tsx

"use client";

import { CheckCircle2, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { reinstateOccurrence, resolveOccurrence } from "@/app/_actions";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ResolveButtonProps {
  occurrenceId: string;
  resolvedAt: Date | null;
}

export default function ResolveButton({
  occurrenceId,
  resolvedAt,
}: ResolveButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isWorking, setIsWorking] = useState(false);

  const isResolved = Boolean(resolvedAt);
  const label = isResolved ? "Reinstate" : "Resolve";
  const Icon = isResolved ? RotateCcw : CheckCircle2;
  const action = isResolved ? reinstateOccurrence : resolveOccurrence;
  const toneClass = isResolved
    ? "border-rose-500/30 text-rose-200 hover:bg-rose-500/10 hover:text-rose-100"
    : "border-emerald-500/30 text-emerald-200 hover:bg-emerald-500/10 hover:text-emerald-100";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending || isWorking}
          aria-disabled={isPending || isWorking}
          className={toneClass}
          onClick={() => {
            setIsWorking(true);
            void action(occurrenceId)
              .catch((error) => {
                console.error("Resolve action failed:", error);
              })
              .finally(() => {
                setIsWorking(false);
                startTransition(() => router.refresh());
              });
          }}
        >
          <Icon className="mr-2 size-4" aria-hidden="true" />
          {label}
        </Button>
      </TooltipTrigger>
      <TooltipContent sideOffset={6}>
        {isResolved ? "Clear resolved state" : "Mark as resolved"}
      </TooltipContent>
    </Tooltip>
  );
}
