import type { Route } from 'next';

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
