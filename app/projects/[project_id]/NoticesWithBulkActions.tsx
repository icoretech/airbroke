// app/projects/[project_id]/NoticesWithBulkActions.tsx

"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { resolveAllByProjectEnv } from "@/app/_actions";
import { Button } from "@/components/ui/button";

interface NoticesWithBulkActionsProps {
  projectId: string;
  activeEnv?: string;
  children: React.ReactNode;
}

export default function NoticesWithBulkActions({
  projectId,
  activeEnv,
  children,
}: NoticesWithBulkActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleResolveAllEnv() {
    void resolveAllByProjectEnv(projectId, activeEnv)
      .then(() => {
        startTransition(() => router.refresh());
      })
      .catch((error) => console.error("Resolve all env failed:", error));
  }

  return (
    <div>
      {activeEnv && (
        <div className="flex items-center gap-3 px-4 py-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            className="border-amber-500/30 text-amber-200 hover:bg-amber-500/10 hover:text-amber-100"
            onClick={handleResolveAllEnv}
          >
            <CheckCircle2 className="mr-2 size-4" aria-hidden="true" />
            Resolve all {activeEnv}
          </Button>
        </div>
      )}
      {children}
    </div>
  );
}
