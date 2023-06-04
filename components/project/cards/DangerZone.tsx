import ConfirmationDialog from '@/components/ConfirmationDialog';
import { getProjectById } from '@/lib/queries/projects';
import ToggleIntake from './ToggleIntake';

type DangerZoneProps = {
  projectId: string;
};

export default async function DangerZone({ projectId }: DangerZoneProps) {
  const project = await getProjectById(projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  return (
    <div className="space-y-4">
      <header>
        <h3 className="text-sm font-semibold text-rose-500">Danger Zone</h3>
      </header>

      <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <div className="md:flex-1">
          <ConfirmationDialog
            projectId={project.id}
            title="Delete All Errors"
            body={`Are you sure you want to delete all exceptions for the project "${project.name}"? This action cannot be undone.`}
            btnId="deleteAllErrors"
          />
        </div>

        <div className="md:flex-1">
          <ConfirmationDialog
            projectId={project.id}
            title="Delete Project"
            body={`Are you sure you want to delete the project "${project.name}"? This action cannot be undone.`}
            btnId="deleteProject"
          />
        </div>
      </div>

      <ToggleIntake projectId={project.id} isPaused={project.paused} />
    </div>
  );
}
