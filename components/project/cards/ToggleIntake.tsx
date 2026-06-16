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
      <div className="flex items-center">
        <Switch
          id={toggleId}
          checked={enabled}
          onCheckedChange={handleToggle}
          disabled={isBusy}
          className="data-[state=checked]:bg-rose-600 data-[state=unchecked]:bg-gray-200"
        />
        <Label htmlFor={toggleId} className="ml-3 text-sm">
          <span className="font-medium text-gray-200">Accept Data</span>{" "}
          <span className="text-gray-400">
            ({enabled ? "Active" : "Paused"})
          </span>
        </Label>
      </div>
      <ClientMutationError message={errorMessage} />
    </div>
  );
}
