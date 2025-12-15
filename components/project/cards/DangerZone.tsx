// components/project/cards/DangerZone.tsx

import { SlFire } from "react-icons/sl";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import DangerActions from "./DangerActions";
import ToggleIntake from "./ToggleIntake";
import type { Project } from "@/prisma/generated/client";

export default async function DangerZone({ project }: { project: Project }) {
  return (
    <section className="rounded-md border border-rose-700/50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <SlFire className="size-4 text-rose-400" />
        <h2 className="text-sm font-semibold text-rose-400">Danger Zone</h2>
      </div>

      <ItemGroup>
        {/* Intake toggle */}
        <Item size="sm" className="items-center">
          <ItemContent>
            <ItemTitle>Intake</ItemTitle>
            <ItemDescription>
              Pause or resume error collection for this project.
            </ItemDescription>
          </ItemContent>
          <ToggleIntake projectId={project.id} isPaused={project.paused} />
        </Item>
        <ItemSeparator />

        {/* Destructive actions */}
        <Item size="sm" className="block">
          <ItemTitle className="text-rose-300">Destructive Actions</ItemTitle>
          <ItemDescription className="mt-1">
            These operations cannot be undone.
          </ItemDescription>
          <div className="mt-3">
            <DangerActions projectId={project.id} projectName={project.name} />
          </div>
        </Item>
      </ItemGroup>
    </section>
  );
}
