// components/project/EditForm.tsx

"use client";

import { useActionState } from "react";
import { SlFire } from "react-icons/sl";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { updateProject } from "@/lib/actions/projectActions";
import type { ProjectResponse } from "@/lib/actions/projectActions";
import type { Project } from "@/prisma/generated/client";

const initialState: ProjectResponse = {};

export default function EditForm({
  project,
  vertical = false,
  bare = false,
}: {
  project: Project;
  vertical?: boolean;
  bare?: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    updateProject,
    initialState,
  );

  return (
    <form
      action={formAction}
      className={bare ? "" : "px-4 py-6 text-foreground sm:px-6 lg:px-8"}
    >
      {/* Card container */}
      <div className="overflow-hidden">
        {!bare && (
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-semibold leading-7 text-foreground">
              Edit Project Settings
            </h2>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              Update your project&rsquo;s metadata or repository details. When
              finished, click &ldquo;Save&rdquo; to apply changes.
            </p>
          </div>
        )}

        {/* Error display (if any) */}
        {state.error && (
          <Alert
            variant="destructive"
            className={bare ? undefined : "rounded-none border-x-0"}
          >
            <SlFire aria-hidden="true" />
            <AlertTitle>Submission Error</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        {/* Hidden field for the projectId */}
        <input type="hidden" name="projectId" value={project.id} />

        {/* Form fields */}
        <div
          className={
            bare
              ? "space-y-6"
              : "space-y-6 border-t border-border px-4 py-5 sm:p-6"
          }
        >
          <FieldGroup
            className={
              vertical
                ? "grid grid-cols-1 gap-6"
                : "grid grid-cols-1 gap-6 sm:grid-cols-6"
            }
          >
            <Field className={vertical ? undefined : "sm:col-span-3"}>
              <FieldLabel htmlFor="organization">Organization</FieldLabel>
              <Input
                id="organization"
                name="organization"
                autoComplete="off"
                placeholder={project.organization}
                defaultValue={project.organization}
              />
              {state.errors?.organization && (
                <FieldError>{state.errors.organization[0]}</FieldError>
              )}
            </Field>

            <Field className={vertical ? undefined : "sm:col-span-3"}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                name="name"
                autoComplete="off"
                defaultValue={project.name}
              />
              {state.errors?.name && (
                <FieldError>{state.errors.name[0]}</FieldError>
              )}
            </Field>

            <Field className={vertical ? undefined : "sm:col-span-2"}>
              <FieldLabel htmlFor="repo_url">Repository URL</FieldLabel>
              <Input
                id="repo_url"
                name="repo_url"
                autoComplete="off"
                defaultValue={project.repo_url ?? ""}
                placeholder="https://github.com/example-org/sample-app"
              />
              {state.errors?.repo_url ? (
                <FieldError>{state.errors.repo_url[0]}</FieldError>
              ) : (
                <FieldDescription>
                  Paste a full repository URL from GitHub, GitLab, Bitbucket, or
                  Gitea.
                </FieldDescription>
              )}
            </Field>

            <Field className={vertical ? undefined : "sm:col-span-2"}>
              <FieldLabel htmlFor="repo_branch">Repository Branch</FieldLabel>
              <Input
                id="repo_branch"
                name="repo_branch"
                autoComplete="off"
                defaultValue={project.repo_branch ?? ""}
                placeholder="main"
              />
              {state.errors?.repo_branch && (
                <FieldError>{state.errors.repo_branch[0]}</FieldError>
              )}
            </Field>

            <Field className={vertical ? undefined : "sm:col-span-2"}>
              <FieldLabel htmlFor="repo_issue_tracker">
                Repository Issue Tracker
              </FieldLabel>
              <Input
                id="repo_issue_tracker"
                name="repo_issue_tracker"
                autoComplete="off"
                defaultValue={project.repo_issue_tracker ?? ""}
                placeholder="https://github.com/example-org/sample-app/issues"
              />
              {state.errors?.repo_issue_tracker && (
                <FieldError>{state.errors.repo_issue_tracker[0]}</FieldError>
              )}
            </Field>
          </FieldGroup>

          {/* Additional note or help text */}
          <Alert>
            <AlertDescription className="text-xs">
              <strong>Tip:</strong> If you're using GitHub or another provider,
              be sure to update <code>repo_url</code> and{" "}
              <code>repo_issue_tracker</code> to direct your backtrace links or
              issue references to the correct location.
            </AlertDescription>
          </Alert>
        </div>

        {/* Action buttons */}
        <div
          className={
            bare
              ? "text-right pt-2"
              : "border-t border-border px-4 py-3 text-right sm:px-6"
          }
        >
          <Button type="submit" disabled={pending}>
            {pending && <Spinner data-icon="inline-start" />}
            <span>{pending ? "Saving..." : "Save"}</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
