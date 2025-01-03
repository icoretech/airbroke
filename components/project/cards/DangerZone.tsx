// components/project/cards/DangerZone.tsx

import ConfirmationDialog from '@/components/ConfirmationDialog';
import ToggleIntake from './ToggleIntake';

import type { Project } from '@prisma/client';

export default async function DangerZone({ project }: { project: Project }) {
  return (
    <div className="space-y-6">
      <h2 className="text-base font-bold text-rose-500">Danger Zone</h2>
      {/* Row: toggle intake */}
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h3 className="text-sm font-semibold text-gray-100">Pause / Resume Project</h3>
        <p className="mt-1 text-xs text-gray-300">Temporarily disable error tracking for this project.</p>
        <div className="mt-3">
          <ToggleIntake projectId={project.id} isPaused={project.paused} />
        </div>
      </div>
      {/* Row: destructive actions */}
      <div className="rounded-lg border border-rose-600 bg-rose-900/10 p-4">
        <h3 className="text-sm font-semibold text-rose-300">Destructive Actions</h3>
        <p className="mt-1 text-xs text-rose-200">
          The following actions cannot be undone. Please proceed with caution.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Delete All Errors */}
          <ConfirmationDialog
            projectId={project.id}
            title="Delete All Errors"
            body={`Are you sure you want to delete all exceptions for the project "${project.name}"? This action cannot be undone.`}
            btnId="deleteAllErrors"
          />
          {/* Delete Project */}
          <ConfirmationDialog
            projectId={project.id}
            title="Delete Project"
            body={`Are you sure you want to delete the project "${project.name}"? This action cannot be undone.`}
            btnId="deleteProject"
          />
        </div>
      </div>
    </div>
  );
}
