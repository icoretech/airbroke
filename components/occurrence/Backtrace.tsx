// components/occurrence/Backtrace.tsx

import clsx from "clsx";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { getOccurrenceById } from "@/lib/queries/occurrences";
import LinkedBacktraceLine from "./BacktraceLine";
import ClipboardButton from "./ClipboardButton";
import type { Prisma } from "@/prisma/generated/client";

/**
 * We can extend Prisma.JsonObject with a string index signature,
 * and declare the required backtrace fields: file, line, function.
 *
 * - Prisma.JsonObject requires `[key: string]: JsonValue | undefined;`
 *   so we replicate that here, plus our known fields.
 */
interface BacktraceJsonObject extends Prisma.JsonObject {
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
  if (typeof item !== "object" || item === null || Array.isArray(item)) {
    return false;
  }

  return (
    typeof item.file === "string" &&
    typeof item.line === "number" &&
    typeof item.function === "string"
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
    .join("\n");
}

/**
 * A server component that fetches a single occurrence by ID and
 * displays its backtrace (if available) in both JSON and plain text forms.
 */
export default async function Backtrace({
  occurrenceId,
}: {
  occurrenceId: string;
}) {
  const occurrence = await getOccurrenceById(occurrenceId);
  if (!occurrence) {
    throw new Error("Occurrence not found");
  }

  const traces = Array.isArray(occurrence.backtrace)
    ? occurrence.backtrace.filter(isBacktraceItem)
    : [];
  if (traces.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No backtrace recorded</EmptyTitle>
          <EmptyDescription>
            The error reporter did not include any stack frames for this
            occurrence.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {/* Copy JSON */}
          <ClipboardButton json={occurrence.backtrace} />
          {/* Copy plain text */}
          <ClipboardButton json={generatePlainTextFromJson(traces)} text />
        </div>
      </div>

      {Array.isArray(occurrence.backtrace) && (
        <div className="flex items-start justify-between overflow-x-auto">
          <div className="min-w-0 flex-1">
            {(() => {
              const seenKeys = new Map<string, number>();

              return traces.map((trace) => {
                const baseKey = `${trace.file}:${trace.line}:${trace.function}`;
                const seenCount = seenKeys.get(baseKey) ?? 0;
                seenKeys.set(baseKey, seenCount + 1);
                const traceKey =
                  seenCount === 0 ? baseKey : `${baseKey}-${seenCount + 1}`;

                return (
                  <div
                    key={traceKey}
                    className="flex flex-row flex-wrap justify-start font-mono text-xs"
                  >
                    <p
                      className={clsx(
                        "text-xs text-muted-foreground",
                        trace.file.includes("PROJECT_ROOT") && "font-semibold",
                      )}
                    >
                      <LinkedBacktraceLine
                        file={trace.file}
                        line={trace.line}
                        project={occurrence.notice.project}
                      />
                    </p>
                    <p className="mx-1 text-muted-foreground">:</p>
                    <p className="text-xs font-semibold text-primary">
                      {trace.line}
                    </p>
                    <p className="mx-1 text-muted-foreground">→</p>
                    <p className="whitespace-nowrap text-xs font-semibold text-foreground">
                      {trace.function}
                    </p>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
