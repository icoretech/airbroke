import { KeyValuePair, flattenObject, isObjectWithKeys } from '@/lib/occurrenceUtils';
import { Occurrence } from '@prisma/client';

export default function Context({ occurrence }: { occurrence: Occurrence }) {
  return (
    <div className="px-4 text-white sm:px-6 lg:px-8">
      <div className="mt-6 border-t border-white/10">
        {isObjectWithKeys(occurrence.context) && (
          <dl className="divide-y divide-white/10">
            {flattenObject(occurrence.context).map((item: KeyValuePair) => (
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
