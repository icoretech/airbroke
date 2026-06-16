interface NoticeTrace {
  file: string;
  line: number;
  function: string;
}

interface RawNoticeTrace {
  file?: unknown;
  line?: unknown;
  function?: unknown;
}

export interface NoticeError {
  type: string;
  message: string;
  backtrace: NoticeTrace[];
}

interface RawNoticeError {
  type?: unknown;
  message?: unknown;
  backtrace?: unknown;
}

interface RawNoticeData {
  errors?: unknown;
  context?: unknown;
  environment?: unknown;
  session?: unknown;
  params?: unknown;
}

export interface NoticeData {
  errors: NoticeError[];
  context: Record<string, unknown>;
  environment: Record<string, unknown>;
  session: Record<string, unknown>;
  params: Record<string, unknown>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function recordOrEmpty(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function rawNoticeDataOrEmpty(value: unknown): RawNoticeData {
  const record = recordOrEmpty(value);
  return {
    context: record.context,
    environment: record.environment,
    errors: record.errors,
    params: record.params,
    session: record.session,
  };
}

function rawNoticeErrorOrEmpty(value: unknown): RawNoticeError {
  const record = recordOrEmpty(value);
  return {
    backtrace: record.backtrace,
    message: record.message,
    type: record.type,
  };
}

function rawNoticeTraceOrEmpty(value: unknown): RawNoticeTrace {
  const record = recordOrEmpty(value);
  return {
    file: record.file,
    function: record.function,
    line: record.line,
  };
}

function stringOrDefault(value: unknown, fallback: string): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function numberOrDefault(value: unknown, fallback: number): number {
  return typeof value === "number" ? value : fallback;
}

export default function normalizeNoticeData(
  rawNoticeData: unknown,
): NoticeData {
  const noticeData = rawNoticeDataOrEmpty(rawNoticeData);
  const normalizedNotice: NoticeData = {
    errors: [],
    context: recordOrEmpty(noticeData.context),
    environment: recordOrEmpty(noticeData.environment),
    session: recordOrEmpty(noticeData.session),
    params: recordOrEmpty(noticeData.params),
  };

  if (Array.isArray(noticeData.errors)) {
    noticeData.errors.forEach((error) => {
      const rawError = rawNoticeErrorOrEmpty(error);
      const normalizedError: NoticeError = {
        type: stringOrDefault(rawError.type, "UnknownError"),
        message: stringOrDefault(rawError.message, "No message provided"),
        backtrace: [],
      };

      if (Array.isArray(rawError.backtrace)) {
        rawError.backtrace.forEach((trace) => {
          const rawTrace = rawNoticeTraceOrEmpty(trace);
          const normalizedTrace: NoticeTrace = {
            file: stringOrDefault(rawTrace.file, ""),
            line: numberOrDefault(rawTrace.line, 0),
            function: stringOrDefault(rawTrace.function, ""),
          };
          normalizedError.backtrace.push(normalizedTrace);
        });
      }

      normalizedNotice.errors.push(normalizedError);
    });
  }

  return normalizedNotice;
}
