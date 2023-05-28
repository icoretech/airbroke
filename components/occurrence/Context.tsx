import { KeyValuePair, flattenObject, isObjectWithKeys } from '@/lib/occurrenceUtils';
import { getOccurrenceById } from '@/lib/queries/occurrences';

interface ContextProps {
  occurrenceId: string;
}

async function Context({ occurrenceId }: ContextProps) {
  const occurrence = await getOccurrenceById(occurrenceId);
  if (!occurrence) {
    throw new Error('Occurrence not found');
  }

  return (
    <div className="overflow-x-auto rounded bg-gray-800 px-4 py-6 text-gray-200 shadow-lg sm:px-6 lg:px-8">
      {isObjectWithKeys(occurrence.context) && (
        <div className="space-y-4">
          {flattenObject(occurrence.context).map((item: KeyValuePair, index) => (
            <div
              className="flex items-start space-x-2 rounded border border-gray-700 bg-gradient-to-r from-gray-700 to-gray-800 p-2 shadow-sm"
              key={item.key}
            >
              <div className="flex-shrink-0 text-sm font-semibold text-indigo-200">{item.key}:</div>
              <div className="flex-grow break-all rounded px-2 font-mono text-sm text-gray-300">
                {JSON.stringify(item.value)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Context as unknown as (props: ContextProps) => JSX.Element;
