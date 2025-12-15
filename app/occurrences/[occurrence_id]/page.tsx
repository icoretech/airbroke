// app/occurrences/[occurrence_id]/page.tsx

import clsx from "clsx";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BiSolidCarCrash, BiSolidNetworkChart } from "react-icons/bi";
import { CgToolbox } from "react-icons/cg";
import { FaEnvira, FaLink } from "react-icons/fa6";
import { LuListEnd } from "react-icons/lu";
import { MdAccountCircle } from "react-icons/md";
import { SlGraph } from "react-icons/sl";
import CounterLabel from "@/components/CounterLabel";
import CustomTimeAgo from "@/components/CustomTimeAgo";
import EnvironmentLabel from "@/components/EnvironmentLabel";
import OccurrenceChartWrapper from "@/components/OccurrenceChartWrapper";
import Backtrace from "@/components/occurrence/Backtrace";
import BookmarkButton from "@/components/occurrence/BookmarkButton";
import Context from "@/components/occurrence/Context";
import Environment from "@/components/occurrence/Environment";
import Params from "@/components/occurrence/Params";
import ResolveButton from "@/components/occurrence/ResolveButton";
import Session from "@/components/occurrence/Session";
import Toolbox from "@/components/occurrence/Toolbox";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { checkOccurrenceBookmarkExistence } from "@/lib/queries/occurrenceBookmarks";
import { getOccurrenceById } from "@/lib/queries/occurrences";
import type { Metadata, Route } from "next";
import type { OccurrenceTabKeys, OccurrenceTabs } from "@/types/airbroke";

type ComponentProps = {
  params: Promise<{ occurrence_id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export async function generateMetadata(
  props: ComponentProps,
): Promise<Metadata> {
  const params = await props.params;
  const occurrence = await getOccurrenceById(params.occurrence_id);
  return { title: occurrence?.message };
}

// /occurrences/:occurrence_id
export default async function Occurrence(props: ComponentProps) {
  const [resolvedSearchParams, resolvedParams, session] = await Promise.all([
    props.searchParams,
    props.params,
    auth(),
  ]);

  const occurrence = await getOccurrenceById(resolvedParams.occurrence_id);
  if (!occurrence) {
    notFound();
  }

  const userId = session?.user?.id;
  const isBookmarked = await checkOccurrenceBookmarkExistence(
    userId,
    occurrence.id,
  );
  const hasSession =
    occurrence.session && Object.keys(occurrence.session).length > 0;
  const hasParams =
    occurrence.params && Object.keys(occurrence.params).length > 0;
  const hasEnvironment =
    occurrence.environment && Object.keys(occurrence.environment).length > 0;

  const tabKeys: OccurrenceTabKeys[] = [
    "backtrace",
    "context",
    "environment",
    "session",
    "params",
    "chart",
    "toolbox",
  ];

  const currentTab: OccurrenceTabKeys = tabKeys.includes(
    resolvedSearchParams.tab as OccurrenceTabKeys,
  )
    ? (resolvedSearchParams.tab as OccurrenceTabKeys)
    : "backtrace";

  const tabs: OccurrenceTabs = {
    backtrace: {
      id: "backtrace",
      name: "Backtrace",
      current: currentTab === "backtrace",
      icon: LuListEnd,
      href: `/occurrences/${occurrence.id}?tab=backtrace` as Route,
    },
    context: {
      id: "context",
      name: "Context",
      current: currentTab === "context",
      icon: BiSolidNetworkChart,
      href: `/occurrences/${occurrence.id}?tab=context` as Route,
    },
    environment: hasEnvironment
      ? {
          id: "environment",
          name: "Environment",
          current: currentTab === "environment",
          icon: FaEnvira,
          href: `/occurrences/${occurrence.id}?tab=environment` as Route,
        }
      : undefined,
    session: hasSession
      ? {
          id: "session",
          name: "Session",
          current: currentTab === "session",
          icon: MdAccountCircle,
          href: `/occurrences/${occurrence.id}?tab=session` as Route,
        }
      : undefined,
    params: hasParams
      ? {
          id: "params",
          name: "Params",
          current: currentTab === "params",
          icon: FaLink,
          href: `/occurrences/${occurrence.id}?tab=params` as Route,
        }
      : undefined,
    chart: {
      id: "chart",
      name: "Chart",
      current: currentTab === "chart",
      icon: SlGraph,
      href: `/occurrences/${occurrence.id}?tab=chart` as Route,
    },
    toolbox: {
      id: "toolbox",
      name: "Toolbox",
      current: currentTab === "toolbox",
      icon: CgToolbox,
      href: `/occurrences/${occurrence.id}?tab=toolbox` as Route,
    },
  };

  return (
    <div className="space-y-6">
      {/* Occurrence header */}
      <section className="rounded-xl border border-card/40 bg-card/40 p-4 shadow-md ring-1 ring-card/40 backdrop-blur sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-10 items-center justify-center rounded-lg bg-purple-500/10 ring-1 ring-inset ring-purple-500/30">
                <BiSolidCarCrash
                  className="size-5 text-purple-300"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-muted-foreground">
                  Project
                </div>
                <Link
                  href={`/projects/${occurrence.notice.project.id}`}
                  className="mt-1 block truncate text-sm font-semibold text-foreground underline decoration-current underline-offset-4 hover:text-foreground/80"
                >
                  {occurrence.notice.project.organization} /{" "}
                  {occurrence.notice.project.name}
                </Link>

                <div className="mt-2 text-xs font-medium text-muted-foreground">
                  Notice
                </div>
                <Link
                  href={`/notices/${occurrence.notice_id}`}
                  className="mt-1 block truncate text-sm text-foreground underline decoration-current underline-offset-4 hover:text-foreground/80"
                >
                  {occurrence.notice.kind}
                </Link>

                <h1 className="mt-3 max-w-full text-xl font-semibold leading-tight text-foreground wrap-anywhere">
                  {occurrence.message}
                </h1>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <EnvironmentLabel
                env={occurrence.notice.env}
                className="flex-none"
              />
              {occurrence.resolved_at && (
                <Badge variant="secondary">Resolved</Badge>
              )}
              <CounterLabel counter={occurrence.seen_count} />
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <ResolveButton
                occurrenceId={occurrence.id}
                resolvedAt={occurrence.resolved_at}
              />
              <BookmarkButton
                isBookmarked={isBookmarked}
                occurrenceId={occurrence.id}
              />
            </div>

            <div className="text-xs text-muted-foreground">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="whitespace-nowrap">First seen:</span>
                <span title={occurrence.created_at.toUTCString()}>
                  <CustomTimeAgo date={new Date(occurrence.created_at)} />
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="whitespace-nowrap">Last seen:</span>
                <span title={occurrence.updated_at.toUTCString()}>
                  <CustomTimeAgo date={new Date(occurrence.updated_at)} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs + content */}
      <section className="rounded-xl sm:overflow-hidden sm:border sm:border-card/40 sm:bg-card/40 sm:shadow-md sm:ring-1 sm:ring-card/40 sm:backdrop-blur">
        <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-lg border border-card/40 bg-card/40 px-4 py-3 shadow-xs sm:rounded-none sm:border-0 sm:bg-transparent sm:shadow-none sm:border-b sm:border-card/40">
          <nav className="flex flex-wrap gap-2" aria-label="Tabs">
            {Object.values(tabs).map((tab) =>
              tab ? (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={clsx(
                    tab.current
                      ? "bg-accent/40 text-foreground"
                      : "text-muted-foreground hover:bg-accent/30 hover:text-foreground",
                    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  )}
                  aria-current={tab.current ? "page" : undefined}
                >
                  <tab.icon className="size-4" aria-hidden="true" />
                  <span className="hidden md:inline">{tab.name}</span>
                </Link>
              ) : null,
            )}
          </nav>
        </div>

        <div className="pt-0">
          {currentTab === "backtrace" && (
            <Backtrace occurrenceId={occurrence.id} />
          )}
          {currentTab === "context" && <Context occurrence={occurrence} />}
          {currentTab === "environment" && (
            <Environment occurrence={occurrence} />
          )}
          {currentTab === "session" && <Session occurrenceId={occurrence.id} />}
          {currentTab === "params" && <Params occurrence={occurrence} />}
          {currentTab === "chart" && (
            <OccurrenceChartWrapper occurrenceId={occurrence.id} />
          )}
          {currentTab === "toolbox" && <Toolbox occurrenceId={occurrence.id} />}
        </div>
      </section>
    </div>
  );
}
