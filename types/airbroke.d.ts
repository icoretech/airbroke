// types/airbroke.d.ts

import type { Route } from "next";
import type { IconType } from "react-icons";

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

export type Tab = {
  id: string;
  name: string;
  current: boolean;
  icon: IconType;
  href: Route;
};

export type OccurrenceTabKeys =
  | "backtrace"
  | "context"
  | "environment"
  | "session"
  | "params"
  | "chart"
  | "toolbox";
export type OccurrenceTabs = {
  [K in OccurrenceTabKeys]: Tab | undefined;
};

export type ProjectTabKeys = "overview" | "integrations" | "edit";
export type ProjectTabs = {
  [K in ProjectTabKeys]: Tab;
};
