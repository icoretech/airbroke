// app/projects/[project_id]/edit/page.tsx

import { notFound } from "next/navigation";
import EditForm from "@/components/project/EditForm";
import Overview from "@/components/project/Overview";
import { getProjectById } from "@/lib/queries/projects";

type ComponentProps = {
  params: Promise<{ project_id: string }>;
};

export default async function ProjectEditPage(props: ComponentProps) {
  const params = await props.params;

  const project = await getProjectById(params.project_id);
  if (!project) {
    notFound();
  }

  return (
    <div className="pb-8">
      {/* Overview includes Activity, Health, Quick Actions, Integrations, Danger Zone; Repository slot overridden by EditForm */}
      <Overview
        project={project}
        repositoryOverride={<EditForm project={project} vertical bare />}
      />
    </div>
  );
}
