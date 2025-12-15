// components/project/EditForm.tsx

"use client";

import { useActionState } from "react";
import { SlDisc, SlFire } from "react-icons/sl";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
      className={bare ? "" : "px-4 py-6 text-white sm:px-6 lg:px-8"}
    >
      {/* Card container */}
      <div className="overflow-hidden">
        {!bare && (
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-semibold leading-7 text-white">
              Edit Project Settings
            </h2>
            <p className="mt-1 text-sm leading-5 text-gray-300">
              Update your project&rsquo;s metadata or repository details. When
              finished, click &ldquo;Save&rdquo; to apply changes.
            </p>
          </div>
        )}

        {/* Error display (if any) */}
        {state.error && (
          <div
            className={
              bare
                ? "bg-rose-800 px-3 py-3"
                : "border-t border-white/10 bg-rose-800 px-4 py-4 sm:px-6"
            }
          >
            <div className="flex">
              <div className="shrink-0">
                <SlFire className="h-5 w-5 text-red-200" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-white">
                  Submission Error
                </h3>
                <div className="mt-2 text-sm text-red-200">{state.error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Hidden field for the projectId */}
        <input type="hidden" name="projectId" value={project.id} />

        {/* Form fields */}
        <div
          className={
            bare
              ? "space-y-6"
              : "space-y-6 border-t border-white/10 px-4 py-5 sm:p-6"
          }
        >
          {/* Row 1: Organization & Name */}
          <div
            className={
              vertical
                ? "grid grid-cols-1 gap-6"
                : "grid grid-cols-1 gap-6 sm:grid-cols-6"
            }
          >
            {/* Organization */}
            <div className="sm:col-span-3">
              <Field>
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
            </div>

            {/* Name */}
            <div className="sm:col-span-3">
              <Field>
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
            </div>
          </div>

          {/* Row 2: repository fields */}
          <div
            className={
              vertical
                ? "grid grid-cols-1 gap-6"
                : "grid grid-cols-1 gap-6 sm:grid-cols-6"
            }
          >
            {/* repo_url */}
            <div className="sm:col-span-2">
              <Field>
                <FieldLabel htmlFor="repo_url">Repository URL</FieldLabel>
                <Input
                  id="repo_url"
                  name="repo_url"
                  autoComplete="off"
                  defaultValue={project.repo_url ?? ""}
                  placeholder="https://github.com/icoretech/airbroke"
                />
                {state.errors?.repo_url ? (
                  <FieldError>{state.errors.repo_url[0]}</FieldError>
                ) : (
                  <FieldDescription>
                    Paste a full repository URL from GitHub, GitLab, Bitbucket,
                    or Gitea.
                  </FieldDescription>
                )}
              </Field>
            </div>

            {/* repo_branch */}
            <div className="sm:col-span-2">
              <Field>
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
            </div>

            {/* repo_issue_tracker */}
            <div className="sm:col-span-2">
              <Field>
                <FieldLabel htmlFor="repo_issue_tracker">
                  Repository Issue Tracker
                </FieldLabel>
                <Input
                  id="repo_issue_tracker"
                  name="repo_issue_tracker"
                  autoComplete="off"
                  defaultValue={project.repo_issue_tracker ?? ""}
                  placeholder="https://github.com/icoretech/airbroke/issues"
                />
                {state.errors?.repo_issue_tracker && (
                  <FieldError>{state.errors.repo_issue_tracker[0]}</FieldError>
                )}
              </Field>
            </div>
          </div>

          {/* Additional note or help text */}
          <div className="rounded-md bg-airbroke-600 p-4 text-xs text-gray-300">
            <p>
              <strong>Tip:</strong> If you&rsquo;re using GitHub or another
              provider, be sure to update <code>repo_url</code> and{" "}
              <code>repo_issue_tracker</code>
              to direct your backtrace links or issue references to the correct
              location.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div
          className={
            bare
              ? "text-right pt-2"
              : "border-t border-white/10 px-4 py-3 text-right sm:px-6"
          }
        >
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-indigo-200 shadow-sm hover:bg-indigo-600 hover:text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          >
            {pending && (
              <SlDisc
                className="-ml-0.5 h-5 w-5 animate-spin"
                aria-hidden="true"
              />
            )}
            <span>{pending ? "Saving..." : "Save"}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
