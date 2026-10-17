// components/occurrence/Toolbox.tsx

import { getOccurrenceById } from "@/lib/queries/occurrences";
import ToolboxAI from "./toolbox/AI";
import ToolboxCurl from "./toolbox/Curl";
import ToolboxFetch from "./toolbox/Replay";
import type { Context } from "@/types/airbroke";

export default async function Toolbox({
  occurrenceId,
}: {
  occurrenceId: string;
}) {
  const occurrence = await getOccurrenceById(occurrenceId);
  if (!occurrence) {
    throw new Error("Occurrence not found");
  }

  return (
    <ul className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-3">
      <li className="flex min-w-0 flex-col">
        <ToolboxAI occurrenceId={occurrence.id} />
      </li>
      <li className="flex min-w-0 flex-col">
        <ToolboxCurl context={occurrence.context as Context} />
      </li>
      <li className="flex min-w-0 flex-col">
        <ToolboxFetch context={occurrence.context as Context} />
      </li>
    </ul>
  );
}
