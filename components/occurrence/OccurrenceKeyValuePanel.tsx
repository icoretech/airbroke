import { flattenObject, isObjectWithKeys } from "@/lib/occurrenceUtils";
import type { KeyValuePair } from "@/lib/occurrenceUtils";

export default function OccurrenceKeyValuePanel({ value }: { value: unknown }) {
  return (
    <div className="overflow-x-auto px-4 sm:px-6 lg:px-8">
      {isObjectWithKeys(value) && (
        <div className="space-y-4 text-xs">
          {flattenObject(value).map((item: KeyValuePair) => (
            <div
              className="flex items-start space-x-2 rounded border border-airbroke-800 bg-linear-to-r from-gray-900 to-airbroke-900 p-2 shadow-md"
              key={item.key}
            >
              <div className="shrink-0 font-semibold text-indigo-200">
                {item.key}:
              </div>
              <div className="grow break-all rounded px-2 font-mono text-gray-300">
                {JSON.stringify(item.value)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
