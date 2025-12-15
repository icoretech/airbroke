// components/project/cards/ToggleIntake.tsx

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
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
  const [enabled, setEnabled] = useState(!isPaused);
  const [isPending, startTransition] = useTransition();
  const { refresh } = useRouter();

  const toggleId = `toggle-intake-${projectId}`;

  useEffect(() => {
    setEnabled(!isPaused);
  }, [isPaused]);

  async function handleToggle(nextEnabled: boolean) {
    await toggleProjectPausedStatus(projectId);

    startTransition(() => {
      setEnabled(nextEnabled);
      refresh();
    });
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
