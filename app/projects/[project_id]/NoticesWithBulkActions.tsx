"use client";

import { CheckCircle2 } from "lucide-react";
import ClientMutationError from "@/components/common/ClientMutationError";
import { Button } from "@/components/ui/button";
import { useClientMutation } from "@/hooks/useClientMutation";
import { resolveAllByProjectEnv } from "@/lib/actions/noticeActions";

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
  const { errorMessage, isBusy, runMutation } = useClientMutation();

  function handleResolveAllEnv() {
    runMutation({
      action: () => resolveAllByProjectEnv(projectId, activeEnv),
      errorMessage: activeEnv
        ? `Could not resolve ${activeEnv} notices`
        : "Could not resolve notices",
    });
  }

  return (
    <div>
      {activeEnv && (
        <div className="flex items-center gap-3 px-4 py-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isBusy}
            className="border-amber-500/30 text-amber-200 hover:bg-amber-500/10 hover:text-amber-100"
            onClick={handleResolveAllEnv}
          >
            <CheckCircle2 className="mr-2 size-4" aria-hidden="true" />
            Resolve all {activeEnv}
          </Button>
          <ClientMutationError message={errorMessage} />
        </div>
      )}
      {children}
    </div>
  );
}
