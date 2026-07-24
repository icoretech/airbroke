"use client";

import { useState } from "react";
import ClientMutationError from "@/components/common/ClientMutationError";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useClientMutation } from "@/hooks/useClientMutation";
import { toggleProjectPausedStatus } from "@/lib/actions/projectActions";

export default function ToggleIntake({
  projectId,
  isPaused,
}: {
  projectId: string;
  isPaused: boolean;
}) {
  const { errorMessage, isBusy, runMutation } = useClientMutation();
  const [optimistic, setOptimistic] = useState<{
    projectId: string;
    enabled: boolean;
  } | null>(null);
  const toggleId = `toggle-intake-${projectId}`;
  const canonicalEnabled = !isPaused;
  const enabled =
    optimistic?.projectId === projectId &&
    optimistic.enabled !== canonicalEnabled
      ? optimistic.enabled
      : canonicalEnabled;

  function handleToggle(nextEnabled: boolean) {
    setOptimistic({ projectId, enabled: nextEnabled });
    runMutation({
      action: () => toggleProjectPausedStatus(projectId),
      errorMessage: "Could not update intake status",
      onFailure: () => setOptimistic(null),
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3">
        <Switch
          id={toggleId}
          checked={enabled}
          onCheckedChange={handleToggle}
          disabled={isBusy}
        />
        <Label htmlFor={toggleId} className="text-sm">
          <span className="font-medium text-foreground">Accept Data</span>{" "}
          <span className="text-muted-foreground">
            ({enabled ? "Active" : "Paused"})
          </span>
        </Label>
      </div>
      <ClientMutationError message={errorMessage} />
    </div>
  );
}
