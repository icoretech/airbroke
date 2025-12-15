"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteProject, deleteProjectNotices } from "@/app/_actions";
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

export default function DangerActions({
  projectId,
  projectName,
}: {
  projectId: string;
  projectName: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [isWorking, setIsWorking] = useState(false);
  const isBusy = pending || isWorking;

  function handleDeleteAllErrors() {
    setIsWorking(true);
    void deleteProjectNotices(projectId)
      .catch((error) => {
        console.error("Delete all errors failed:", error);
      })
      .finally(() => {
        setIsWorking(false);
        startTransition(() => router.refresh());
      });
  }

  function handleDeleteProject() {
    setIsWorking(true);
    void deleteProject(projectId)
      .catch((error) => {
        console.error("Delete project failed:", error);
      })
      .finally(() => {
        setIsWorking(false);
        startTransition(() => router.push("/projects"));
      });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs text-white/70">
        Irreversible operations. Proceed with caution.
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {/* Delete All Errors */}
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

        {/* Delete Project */}
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
    </div>
  );
}
