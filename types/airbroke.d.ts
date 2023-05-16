export interface BacktraceItem {
  file: string;
  line: number;
  function: string;
}

export type OccurrenceTabKeys = 'backtrace' | 'context' | 'environment' | 'session' | 'params';
