import { KeyValuePair, flattenObject, isObjectWithKeys } from '@/lib/occurrenceUtils';
import { getOccurrenceById } from '@/lib/queries/occurrences';

interface SessionProps {
  occurrenceId: string;
}

async function Session({ occurrenceId }: SessionProps) {
  const occurrence = await getOccurrenceById(occurrenceId);
  if (!occurrence) {
    throw new Error('Occurrence not found');
  }

  return (
    <div className="px-4 text-white sm:px-6 lg:px-8">
      <div className="mt-6 border-t border-white/10">
        {isObjectWithKeys(occurrence.session) && (
          <dl className="divide-y divide-white/10">
            {flattenObject(occurrence.session).map((item: KeyValuePair) => (
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0" key={item.key}>
                <dt className="text-sm font-medium leading-6 text-white">{item.key}</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                  {JSON.stringify(item.value)}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}

export default Session as unknown as (props: SessionProps) => JSX.Element;
