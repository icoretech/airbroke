// components/occurrence/Environment.tsx

import { KeyValuePair, flattenObject, isObjectWithKeys } from '@/lib/occurrenceUtils';

import type { Occurrence } from '@prisma/client';

export default async function Environment({ occurrence }: { occurrence: Occurrence }) {
  return (
    <div className="overflow-x-auto px-4 sm:px-6 lg:px-8">
      {isObjectWithKeys(occurrence.environment) && (
        <div className="space-y-4 text-xs">
          {flattenObject(occurrence.environment).map((item: KeyValuePair) => (
            <div
              className="flex items-start space-x-2 rounded border border-airbroke-800 bg-gradient-to-r from-gray-900 to-airbroke-900 p-2 shadow-md"
              key={item.key}
            >
              <div className="flex-shrink-0 font-semibold text-indigo-200">{item.key}:</div>
              <div className="flex-grow break-all rounded px-2 font-mono text-gray-300">
                {JSON.stringify(item.value)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
