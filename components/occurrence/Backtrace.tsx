import classNames from '@/lib/classNames';
import { getOccurrenceById } from '@/lib/queries/occurrences';
import { Prisma } from '@prisma/client';
import LinkedBacktraceLine from './BacktraceLine';
import ClipboardButton from './ClipboardButton';

interface BacktraceItem {
  file: string;
  line: number;
  function: string;
}

interface BacktraceProps {
  occurrenceId: string;
}

function isBacktraceItem(item: any): item is BacktraceItem {
  return item && typeof item.file === 'string' && typeof item.line === 'number' && typeof item.function === 'string';
}

function generatePlainTextFromJson(backtrace: Prisma.JsonArray): string {
  return backtrace
    .filter(isBacktraceItem)
    .map((trace: any) => {
      // change type here to 'any'
      const backtraceItem = trace as BacktraceItem; // assert type here
      return `${backtraceItem.file} : ${backtraceItem.line} → ${backtraceItem.function}`;
    })
    .join('\n');
}

export default async function Backtrace({ occurrenceId }: BacktraceProps) {
  const occurrence = await getOccurrenceById(occurrenceId);
  if (!occurrence) {
    throw new Error('Occurrence not found');
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="mb-4 flex items-center gap-x-4">
          <ClipboardButton json={occurrence.backtrace} />
          <ClipboardButton json={generatePlainTextFromJson(occurrence.backtrace as Prisma.JsonArray)} text />
        </div>
      </div>
      {occurrence.backtrace && typeof occurrence.backtrace === 'object' && Array.isArray(occurrence.backtrace) && (
        <div className="flex items-start justify-between overflow-x-auto">
          <div className="flex-1">
            {(occurrence.backtrace as Prisma.JsonArray).map(
              (trace, index) =>
                isBacktraceItem(trace) && (
                  <div key={index} className="flex flex-row flex-wrap justify-start font-mono text-xs">
                    <p
                      className={classNames(
                        trace.file.includes('PROJECT_ROOT') ? 'font-semibold' : '',
                        'text-xs text-gray-400'
                      )}
                    >
                      <LinkedBacktraceLine file={trace.file} line={trace.line} project={occurrence.notice.project} />
                    </p>
                    <p className="mx-1 text-gray-400">:</p>
                    <p className="text-xs font-semibold text-indigo-200">{trace.line}</p>
                    <p className="mx-1 text-gray-400">→</p>
                    <p className="text-xs font-semibold text-rose-500">{trace.function}</p>
                  </div>
                )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
