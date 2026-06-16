"use client";

import { useRouter } from "next/navigation";
import ClientMutationError from "@/components/common/ClientMutationError";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useClientMutation } from "@/hooks/useClientMutation";
import {
  deleteProject,
  deleteProjectNotices,
} from "@/lib/actions/projectActions";

export default function DangerActions({
  projectId,
  projectName,
}: {
  projectId: string;
  projectName: string;
}) {
  const router = useRouter();
  const { errorMessage, isBusy, runMutation } = useClientMutation();

  function handleDeleteAllErrors() {
    runMutation({
      action: () => deleteProjectNotices(projectId),
      errorMessage: "Could not delete project errors",
    });
  }

  function handleDeleteProject() {
    runMutation({
      action: () => deleteProject(projectId),
      errorMessage: "Could not delete project",
      onSuccess: () => router.push("/projects"),
      refreshOnSuccess: false,
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs text-white/70">
        Irreversible operations. Proceed with caution.
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={isBusy}>
              Delete All Errors
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete all errors?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove all exceptions for "{projectName}". This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isBusy}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  handleDeleteAllErrors();
                }}
                disabled={isBusy}
              >
                Delete All Errors
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={isBusy}>
              Delete Project
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete project?</AlertDialogTitle>
              <AlertDialogDescription>
                Project "{projectName}" will be permanently deleted. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isBusy}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  handleDeleteProject();
                }}
                disabled={isBusy}
              >
                Delete Project
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <ClientMutationError message={errorMessage} />
    </div>
  );
}
