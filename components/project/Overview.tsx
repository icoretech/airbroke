// components/project/Overview.tsx

import Link from "next/link";
import ActivityCard from "@/components/analytics/ActivityCard";
import HealthCard from "@/components/analytics/HealthCard";
import CopyToClipboardButton from "@/components/CopyToClipboardButton";
import IntegrationsGrid from "@/components/IntegrationsGrid";
import { SourceRepoProviderIcon } from "@/components/SourceRepoProviderIcon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import {
  getLastNoticeDateByProjectId,
  getNoticesCountByProjectId,
} from "@/lib/queries/notices";
import {
  getHourlyOccurrenceRateForLast14Days,
  getOccurrencesCountByProjectId,
} from "@/lib/queries/occurrences";
import TestZone from "../TestZone";
import DangerZone from "./cards/DangerZone";
import type { Project } from "@/prisma/generated/client";

export default async function Overview({
  project,
  repositoryOverride,
}: {
  project: Project;
  repositoryOverride?: React.ReactNode;
}) {
  const [
    noticesCount,
    occurrencesCount,
    hourlyOccurrenceRateForLast14Days,
    lastNoticeDate,
  ] = await Promise.all([
    getNoticesCountByProjectId(project.id),
    getOccurrencesCountByProjectId(project.id),
    getHourlyOccurrenceRateForLast14Days(project.id),
    getLastNoticeDateByProjectId(project.id),
  ]);

  const stats = [
    { name: "Notices", value: noticesCount },
    { name: "Occurrences", value: occurrencesCount },
    {
      name: "Incoming Rate",
      value: hourlyOccurrenceRateForLast14Days,
      unit: "/ hour",
    },
  ];

  return (
    <div className="space-y-6 px-4 py-6 text-white sm:px-6 lg:px-8">
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Activity */}
        <ActivityCard projectId={project.id} />
        {/* Health */}
        <HealthCard
          stats={stats}
          paused={project.paused}
          lastNoticeDate={lastNoticeDate}
        />

        {/* Repository or Edit Settings card */}
        <div className="lg:col-span-7">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-white">
                {repositoryOverride ? "Edit Project Settings" : "Repository"}
              </CardTitle>
              {repositoryOverride ? (
                <CardDescription className="text-xs text-white/70">
                  Update your project’s metadata or repository details.
                </CardDescription>
              ) : null}
            </CardHeader>
            <CardContent className="pt-0">
              {repositoryOverride ? (
                repositoryOverride
              ) : project.repo_url ? (
                <ItemGroup>
                  <Item variant="default" size="sm">
                    <ItemMedia variant="icon">
                      <SourceRepoProviderIcon
                        sourceRepoProvider={project.repo_provider}
                      />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>Provider</ItemTitle>
                      <ItemDescription className="capitalize">
                        {project.repo_provider}
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                  <ItemSeparator />
                  <Item variant="default" size="sm">
                    <ItemContent>
                      <ItemTitle>URL</ItemTitle>
                      <ItemDescription className="truncate">
                        <a
                          href={project.repo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="underline"
                        >
                          {project.repo_url}
                        </a>
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                  <ItemSeparator />
                  <Item variant="default" size="sm">
                    <ItemContent>
                      <ItemTitle>Main Branch</ItemTitle>
                      <ItemDescription>
                        {project.repo_branch || "Not set"}
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                  <ItemSeparator />
                  <Item variant="default" size="sm">
                    <ItemContent>
                      <ItemTitle>Issue Tracker</ItemTitle>
                      <ItemDescription className="truncate">
                        {project.repo_issue_tracker ? (
                          <a
                            href={project.repo_issue_tracker}
                            target="_blank"
                            rel="noreferrer"
                            className="underline"
                          >
                            {project.repo_issue_tracker}
                          </a>
                        ) : (
                          "Not set"
                        )}
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                </ItemGroup>
              ) : (
                <Empty>
                  <EmptyMedia variant="icon">
                    <SourceRepoProviderIcon
                      sourceRepoProvider={project.repo_provider}
                      className="size-6"
                    />
                  </EmptyMedia>
                  <EmptyTitle>Connect your repository</EmptyTitle>
                  <EmptyDescription>
                    Add repo URL and issue tracker to enable deep links from
                    backtraces.
                  </EmptyDescription>
                  <EmptyContent>
                    <Button asChild>
                      <Link href={`/projects/${project.id}/edit`}>
                        Edit project
                      </Link>
                    </Button>
                  </EmptyContent>
                </Empty>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-white">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ItemGroup>
                <Item variant="default" size="sm" className="items-center">
                  <ItemContent>
                    <ItemTitle>API Key</ItemTitle>
                    <ItemDescription className="font-mono truncate text-white/80">
                      {project.api_key}
                    </ItemDescription>
                  </ItemContent>
                  <CopyToClipboardButton
                    value={project.api_key}
                    size="icon-sm"
                    variant="outline"
                  />
                </Item>
              </ItemGroup>
              <Separator className="my-3" />
              <TestZone project={project} />
            </CardContent>
          </Card>
        </div>

        {/* Integrations */}
        <div className="lg:col-span-12">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-white">Integrations</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <IntegrationsGrid
                replacements={{ REPLACE_PROJECT_KEY: project.api_key }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Danger Zone (use component's own red styling; no extra wrapper) */}
        <div className="lg:col-span-12">
          <DangerZone project={project} />
        </div>
      </section>
    </div>
  );
}
