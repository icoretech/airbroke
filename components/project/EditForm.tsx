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

type ProjectFieldName = keyof Pick<
  Project,
  "organization" | "name" | "repo_url" | "repo_branch" | "repo_issue_tracker"
>;

type ProjectFieldDefinition = {
  readonly name: ProjectFieldName;
  readonly label: string;
  readonly columns: "sm:col-span-2" | "sm:col-span-3";
  readonly placeholder?: string;
  readonly description?: string;
};

const PROJECT_FIELDS: readonly ProjectFieldDefinition[] = [
  { name: "organization", label: "Organization", columns: "sm:col-span-3" },
  { name: "name", label: "Name", columns: "sm:col-span-3" },
  {
    name: "repo_url",
    label: "Repository URL",
    columns: "sm:col-span-2",
    placeholder: "https://github.com/example-org/sample-app",
    description:
      "Paste a full repository URL from GitHub, GitLab, Bitbucket, or Gitea.",
  },
  {
    name: "repo_branch",
    label: "Repository Branch",
    columns: "sm:col-span-2",
    placeholder: "main",
  },
  {
    name: "repo_issue_tracker",
    label: "Repository Issue Tracker",
    columns: "sm:col-span-2",
    placeholder: "https://github.com/example-org/sample-app/issues",
  },
];

function ProjectField({
  field,
  value,
  errors,
  vertical,
}: {
  readonly field: ProjectFieldDefinition;
  readonly value: string | null;
  readonly errors: readonly string[] | undefined;
  readonly vertical: boolean;
}) {
  return (
    <Field
      data-invalid={!!errors}
      className={vertical ? undefined : field.columns}
    >
      <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        autoComplete="off"
        defaultValue={value ?? ""}
        placeholder={
          field.name === "organization" ? (value ?? "") : field.placeholder
        }
        aria-invalid={!!errors}
        aria-describedby={errors ? `${field.name}-error` : undefined}
      />
      {errors ? (
        <FieldError id={`${field.name}-error`}>{errors[0]}</FieldError>
      ) : (
        field.description && (
          <FieldDescription>{field.description}</FieldDescription>
        )
      )}
    </Field>
  );
}

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
              ? "flex flex-col gap-6"
              : "flex flex-col gap-6 border-t border-border px-4 py-5 sm:p-6"
          }
        >
          <FieldGroup
            className={
              vertical
                ? "grid grid-cols-1 gap-6"
                : "grid grid-cols-1 gap-6 sm:grid-cols-6"
            }
          >
            {PROJECT_FIELDS.map((field) => (
              <ProjectField
                key={field.name}
                field={field}
                value={project[field.name]}
                errors={state.errors?.[field.name]}
                vertical={vertical}
              />
            ))}
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
