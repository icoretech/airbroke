import { KeyValuePair, flattenObject, isObjectWithKeys } from '@/lib/occurrenceUtils';
import { getOccurrenceById } from '@/lib/queries/occurrences';

interface ContextProps {
  occurrenceId: string;
}

export default async function Context({ occurrenceId }: ContextProps) {
  const occurrence = await getOccurrenceById(occurrenceId);
  if (!occurrence) {
    throw new Error('Occurrence not found');
  }

  return (
    <div className="overflow-x-auto px-4 sm:px-6 lg:px-8">
      {isObjectWithKeys(occurrence.context) && (
        <div className="space-y-4 text-xs">
          {flattenObject(occurrence.context).map((item: KeyValuePair) => (
            <div
              className="flex items-start space-x-2 rounded border border-airbroke-800 bg-gradient-to-r from-gray-900 to-airbroke-900 p-2 shadow-md"
              key={item.key}
            >
              <div className="flex-shrink-0 font-semibold text-indigo-200">{item.key}:</div>
              <div className="flex-grow break-all rounded px-2 font-mono  text-gray-300">
                {JSON.stringify(item.value)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
