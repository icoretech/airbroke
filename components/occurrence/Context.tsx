import { occurrence } from '@prisma/client';

interface KeyValuePair {
  key: string;
  value: any;
}

function objectToArray(obj: Record<string, any>): KeyValuePair[] {
  return Object.entries(obj).map(([key, value]) => ({ key, value }));
}
function isObjectWithKeys(item: any): item is Record<string, any> {
  return (
    item &&
    typeof item === 'object' &&
    !Array.isArray(item) &&
    Object.keys(item).every((key) => typeof key === 'string')
  );
}

export default function Context({ occurrence }: { occurrence: occurrence }) {
  return (
    <div className="px-4 text-white sm:px-6 lg:px-8">
      <div className="mt-6 border-t border-white/10">
        {isObjectWithKeys(occurrence.context) && (
          <dl className="divide-y divide-white/10">
            {objectToArray(occurrence.context).map((item: KeyValuePair) => (
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
