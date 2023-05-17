import classNames from '@/lib/classNames';
import { BacktraceItem } from '@/types/airbroke';
import { Prisma, occurrence, project } from '@prisma/client';
import LinkedBacktraceLine from './BacktraceLine';

function isBacktraceItem(item: any): item is BacktraceItem {
  return item && typeof item.file === 'string' && typeof item.line === 'number' && typeof item.function === 'string';
}

export default function Backtrace({ occurrence, project }: { occurrence: occurrence; project: project }) {
  return (
    <>
      {occurrence.backtrace && typeof occurrence.backtrace === 'object' && Array.isArray(occurrence.backtrace) && (
        <div className="px-4 sm:px-6 lg:px-8">
          {(occurrence.backtrace as Prisma.JsonArray).map(
            (trace, index) =>
              isBacktraceItem(trace) && (
                <div key={index} className="flex flex-row flex-wrap justify-start pb-1 font-mono text-xs">
                  <p
                    className={classNames(
                      trace.file.includes('PROJECT_ROOT') ? 'font-semibold' : '',
                      'text-xs text-gray-400'
                    )}
                  >
                    <LinkedBacktraceLine file={trace.file} line={trace.line} project={project} />
                  </p>
                  <p className="mx-1 text-gray-400">:</p>
                  <p className="text-xs font-semibold text-indigo-400">{trace.line}</p>
                  <p className="mx-1 text-gray-400">→</p>
                  <p className="text-xs font-semibold text-red-600">{trace.function}</p>
                </div>
              )
          )}
        </div>
      )}
    </>
  );
}
