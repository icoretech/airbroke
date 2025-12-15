"use client";

import { GitBranch } from "lucide-react";
import { useActionState } from "react";
import { SlDisc } from "react-icons/sl";
import { TbFilePlus } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { createProject } from "@/lib/actions/projectActions";
import type { ProjectState } from "@/lib/actions/projectActions";

type CreateProjectDialogProps = {
  /**
   * Optional: render a smaller trigger for compact areas (e.g., topbar)
   */
  size?: "sm" | "md";
  /**
   * Optional: override trigger label
   */
  label?: string;
  /**
   * Optional: extra classes for the trigger button
   */
  className?: string;
};

export default function CreateProjectDialog({
  size = "sm",
  label = "Create Project",
  className,
}: CreateProjectDialogProps) {
  const heightClass = size === "sm" ? "h-9 px-4" : "h-10 px-5";
  const initialState: ProjectState = { error: null, lastUrl: "" };
  const [{ error, lastUrl }, formAction, pending] = useActionState(
    createProject,
    initialState,
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={`${heightClass} inline-flex items-center gap-2 btn-gradient shadow-xs focus-visible:ring-1 focus-visible:ring-offset-0 ${className ?? ""}`}
        >
          <TbFilePlus className="size-4" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create a Project</DialogTitle>
          <DialogDescription>
            Provide your repository URL or create a project without a
            repository.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div className="space-y-4">
            <FieldLabel htmlFor="repository_url">Repository URL</FieldLabel>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <GitBranch className="size-4 text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupInput
                id="repository_url"
                name="repository_url"
                type="text"
                defaultValue={lastUrl}
                disabled={pending}
                placeholder={`https://github.com/owner/repo`}
                aria-invalid={!!error}
              />
              <InputGroupAddon align="inline-end" className="gap-1">
                <Kbd className="hidden sm:inline">paste</Kbd>
              </InputGroupAddon>
            </InputGroup>
            {error ? (
              <FieldError>{error}</FieldError>
            ) : (
              <FieldDescription>
                Paste a full repository URL from GitHub, GitLab, Bitbucket, or
                Gitea. You can also leave it blank.
              </FieldDescription>
            )}
          </div>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                aria-disabled={pending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 btn-gradient"
            >
              {pending && (
                <SlDisc className="h-4 w-4 animate-spin" aria-hidden="true" />
              )}
              <span>{pending ? "Saving..." : "Create"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
