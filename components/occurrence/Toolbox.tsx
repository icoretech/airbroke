// components/occurrence/Toolbox.tsx

import { getOccurrenceById } from '@/lib/queries/occurrences';
import { Context } from '@/types/airbroke';
import ToolboxAI from './toolbox/AI';
import ToolboxCurl from './toolbox/Curl';
import ToolboxFetch from './toolbox/Replay';

export default async function Toolbox({ occurrenceId }: { occurrenceId: string }) {
  const occurrence = await getOccurrenceById(occurrenceId);
  if (!occurrence) {
    throw new Error('Occurrence not found');
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        <li className="col-span-1 flex flex-col divide-y divide-indigo-400/30 rounded-lg text-center shadow">
          <ToolboxAI occurrenceId={occurrence.id} />
        </li>
        <li className="col-span-1 flex flex-col divide-y divide-indigo-400/30 rounded-lg text-center shadow">
          <ToolboxCurl context={occurrence.context as Context} />
        </li>
        <li className="col-span-1 flex flex-col divide-y divide-indigo-400/30 rounded-lg text-center shadow">
          <ToolboxFetch context={occurrence.context as Context} />
        </li>
      </ul>
    </div>
  );
}
