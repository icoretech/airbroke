import ConfirmationDialog from '@/components/ConfirmationDialog';
import { getProjectById } from '@/lib/queries/projects';

type DangerZoneProps = {
  projectId: string;
};

export default async function DangerZone({ projectId }: DangerZoneProps) {
  const project = await getProjectById(projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  return (
    <>
      <h3 className="text-base font-semibold leading-6 text-rose-500">Danger Zone</h3>
      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-1 justify-items-center gap-4">
          <ConfirmationDialog
            projectId={project.id}
            title="Delete All Errors"
            body={`Are you sure you want to delete all exceptions for the project "${project.name}"? This action cannot be undone.`}
            btnId="deleteAllErrors"
          />

          <ConfirmationDialog
            projectId={project.id}
            title="Delete Project"
            body={`Are you sure you want to delete the project "${project.name}"? This action cannot be undone.`}
            btnId="deleteProject"
          />
        </div>
      </div>
    </>
  );
}
