// lib/parseNotice.ts

interface NoticeTrace {
  file: string;
  line: number;
  function: string;
}

export interface NoticeError {
  type: string;
  message: string;
  backtrace: NoticeTrace[];
}

/**
 * The structure of a parsed Notice object.
 */
export interface NoticeData {
  errors: NoticeError[];
  /**
   * Additional context in key-value form.
   */
  context: Record<string, unknown>;
  /**
   * Environment details.
   */
  environment: Record<string, unknown>;
  /**
   * Session details, if any.
   */
  session: Record<string, unknown>;
  /**
   * Params or additional data associated with the notice.
   */
  params: Record<string, unknown>;
}

/**
 * Sanitizes and normalizes a raw NoticeData object to ensure required fields are present.
 *
 * @param noticeData - The raw NoticeData to parse
 * @returns A sanitized and normalized NoticeData object
 */
export default function parseNotice(noticeData: NoticeData): NoticeData {
  console.trace('Received noticeData:', JSON.stringify(noticeData, null, 2));

  const whitelistedNotice: NoticeData = {
    errors: [],
    context: noticeData.context || {},
    environment: noticeData.environment || {},
    session: noticeData.session || {},
    params: noticeData.params || {},
  };

  if (Array.isArray(noticeData.errors)) {
    noticeData.errors.forEach((error) => {
      const whitelistedError: NoticeError = {
        type: error.type || 'UnknownError',
        message: error.message || 'No message provided',
        backtrace: [],
      };

      if (Array.isArray(error.backtrace)) {
        error.backtrace.forEach((trace) => {
          const whitelistedTrace: NoticeTrace = {
            file: trace.file,
            line: trace.line,
            function: trace.function,
          };
          whitelistedError.backtrace.push(whitelistedTrace);
        });
      }

      whitelistedNotice.errors.push(whitelistedError);
    });
  }

  return whitelistedNotice;
}
