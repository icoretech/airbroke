import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { flattenObject, isObjectWithKeys } from "@/lib/occurrenceUtils";
import type { KeyValuePair } from "@/lib/occurrenceUtils";

export default function OccurrenceKeyValuePanel({ value }: { value: unknown }) {
  const entries = isObjectWithKeys(value) ? flattenObject(value) : [];
  if (entries.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No data recorded</EmptyTitle>
          <EmptyDescription>
            This occurrence did not include data for this section.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }
  return (
    <div className="min-w-0 overflow-x-auto">
      <dl className="flex flex-col gap-3 text-xs">
        {entries.map((item: KeyValuePair) => (
          <div
            className="grid min-w-0 gap-1 border-b pb-3 last:border-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-4"
            key={item.key}
          >
            <dt className="font-semibold wrap-anywhere">{item.key}:</dt>
            <dd className="min-w-0 font-mono text-muted-foreground wrap-anywhere">
              {JSON.stringify(item.value)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
