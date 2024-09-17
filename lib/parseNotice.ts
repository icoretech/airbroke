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

export interface NoticeData {
  errors: NoticeError[];
  context: Record<string, any>;
  environment: Record<string, any>;
  session: Record<string, any>;
  params: Record<string, any>;
}

export default function parseNotice(noticeData: NoticeData): NoticeData {
  // console.log('Received noticeData:', JSON.stringify(noticeData, null, 2));

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
