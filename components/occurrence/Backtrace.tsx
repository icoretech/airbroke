// components/occurrence/Backtrace.tsx

import { getOccurrenceById } from '@/lib/queries/occurrences';
import { Prisma } from '@prisma/client';
import clsx from 'clsx';
import LinkedBacktraceLine from './BacktraceLine';
import ClipboardButton from './ClipboardButton';

/**
 * We can extend Prisma.JsonObject with a string index signature,
 * and declare the required backtrace fields: file, line, function.
 *
 * - Prisma.JsonObject requires `[key: string]: JsonValue | undefined;`
 *   so we replicate that here, plus our known fields.
 */
export interface BacktraceJsonObject extends Prisma.JsonObject {
  file: string;
  line: number;
  function: string;
  [key: string]: Prisma.JsonValue | undefined;
}

/**
 * Type guard to verify that a given Prisma.JsonValue
 * is a non-null, non-array object shaped like BacktraceJsonObject.
 */
function isBacktraceItem(item: Prisma.JsonValue): item is BacktraceJsonObject {
  if (typeof item !== 'object' || item === null || Array.isArray(item)) {
    return false;
  }

  const maybeBacktrace = item as Partial<BacktraceJsonObject>;
  return (
    typeof maybeBacktrace.file === 'string' &&
    typeof maybeBacktrace.line === 'number' &&
    typeof maybeBacktrace.function === 'string'
  );
}

/**
 * Converts a JSON array of backtrace items into plain text.
 * Each valid BacktraceJsonObject is formatted as:
 *   "/path/to/file : 123 → functionName"
 */
function generatePlainTextFromJson(backtrace: Prisma.JsonArray): string {
  return backtrace
    .filter((trace): trace is BacktraceJsonObject => isBacktraceItem(trace))
    .map((trace) => `${trace.file} : ${trace.line} → ${trace.function}`)
    .join('\n');
}

/**
 * A server component that fetches a single occurrence by ID and
 * displays its backtrace (if available) in both JSON and plain text forms.
 */
export default async function Backtrace({ occurrenceId }: { occurrenceId: string }) {
  const occurrence = await getOccurrenceById(occurrenceId);
  if (!occurrence) {
    throw new Error('Occurrence not found');
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="mb-4 flex items-center gap-x-4">
          {/* Copy JSON */}
          <ClipboardButton json={occurrence.backtrace} />
          {/* Copy plain text */}
          <ClipboardButton json={generatePlainTextFromJson(occurrence.backtrace as Prisma.JsonArray)} text />
        </div>
      </div>

      {Array.isArray(occurrence.backtrace) && (
        <div className="flex items-start justify-between overflow-x-auto">
          <div className="flex-1">
            {occurrence.backtrace.map((trace, index) => {
              if (!isBacktraceItem(trace)) return null;

              return (
                <div key={index} className="flex flex-row flex-wrap justify-start font-mono text-xs">
                  <p className={clsx('text-xs text-gray-400', trace.file.includes('PROJECT_ROOT') && 'font-semibold')}>
                    <LinkedBacktraceLine file={trace.file} line={trace.line} project={occurrence.notice.project} />
                  </p>
                  <p className="mx-1 text-gray-400">:</p>
                  <p className="text-xs font-semibold text-indigo-200">{trace.line}</p>
                  <p className="mx-1 text-gray-400">→</p>
                  <p className="text-xs font-semibold text-rose-500">{trace.function}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
