import type { Route } from 'next';

export interface BacktraceItem {
  file: string;
  line: number;
  function: string;
}

export type OccurrenceTabKeys = 'backtrace' | 'context' | 'environment' | 'session' | 'params' | 'toolbox';

export interface Context {
  headers?: Record<string, string>;
  httpMethod?: string;
  url?: string;
}

export type Breadcrumb = {
  name: string;
  href: Route<T>;
  current: boolean;
};
