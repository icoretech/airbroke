import { Context } from '@/types/airbroke';
import { occurrence } from '@prisma/client';
import ToolboxAI from './toolbox/AI';
import ToolboxCurl from './toolbox/Curl';
import ToolboxFetch from './toolbox/Replay';

export default function Toolbox({ occurrence }: { occurrence: occurrence }) {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4"
      >
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
