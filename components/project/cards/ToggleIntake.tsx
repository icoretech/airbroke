// components/project/cards/ToggleIntake.tsx

"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toggleProjectPausedStatus } from "@/app/_actions";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function ToggleIntake({
  projectId,
  isPaused,
}: {
  projectId: string;
  isPaused: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [optimisticEnabled, setOptimisticEnabled] = useState<boolean | null>(
    null,
  );
  const { refresh } = useRouter();

  const toggleId = `toggle-intake-${projectId}`;
  const enabled = optimisticEnabled ?? !isPaused;

  if (optimisticEnabled !== null && optimisticEnabled === !isPaused) {
    setOptimisticEnabled(null);
  }

  async function handleToggle(nextEnabled: boolean) {
    setOptimisticEnabled(nextEnabled);

    try {
      await toggleProjectPausedStatus(projectId);
    } catch (error) {
      setOptimisticEnabled(null);
      throw error;
    } finally {
      startTransition(() => {
        refresh();
      });
    }
  }

  return (
    <div className="flex items-center">
      <Switch
        id={toggleId}
        checked={enabled}
        onCheckedChange={(nextEnabled) => {
          void handleToggle(nextEnabled);
        }}
        disabled={isPending}
        className="data-[state=checked]:bg-rose-600 data-[state=unchecked]:bg-gray-200"
      />
      <Label htmlFor={toggleId} className="ml-3 text-sm">
        <span className="font-medium text-gray-200">Accept Data</span>{" "}
        <span className="text-gray-400">({enabled ? "Active" : "Paused"})</span>
      </Label>
    </div>
  );
}
