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
    <div className="px-4 sm:px-6 lg:px-8">
      {isObjectWithKeys(occurrence.context) && (
        <ul>
          {objectToArray(occurrence.context).map((item: KeyValuePair) => (
            <li key={item.key}>
              <span className="font-semibold">{item.key}:</span>
              <span>{JSON.stringify(item.value)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
