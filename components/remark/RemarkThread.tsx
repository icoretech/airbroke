// components/remark/RemarkThread.tsx

import { headers } from "next/headers";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { getAuth } from "@/lib/auth";
import { getProjectById } from "@/lib/queries/projects";
import {
  getRemarksByNoticeId,
  getRemarksByOccurrenceId,
} from "@/lib/queries/remarks";
import RemarkForm from "./RemarkForm";
import RemarkItem from "./RemarkItem";
import type { ComponentProps } from "react";
import type { AutolinkContext } from "@/lib/autolink";

interface RemarkThreadProps {
  noticeId: string;
  occurrenceId?: string;
  projectId: string;
}

type RemarkItemProps = ComponentProps<typeof RemarkItem>;

function RemarkGroup({
  remarks,
  title,
  currentUserId,
  autolinkCtx,
}: {
  readonly remarks: readonly RemarkItemProps["remark"][];
  readonly title?: string;
  readonly currentUserId: string;
  readonly autolinkCtx: AutolinkContext;
}) {
  if (remarks.length === 0) return null;

  return (
    <div>
      {title && (
        <div className="mb-3 border-b border-card/40 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </div>
      )}
      <div className="divide-y divide-card/40">
        {remarks.map((remark) => (
          <RemarkItem
            key={remark.id}
            remark={remark}
            currentUserId={currentUserId}
            autolinkCtx={autolinkCtx}
          />
        ))}
      </div>
    </div>
  );
}

export default async function RemarkThread({
  noticeId,
  occurrenceId,
  projectId,
}: RemarkThreadProps) {
  const [session, project, remarks] = await Promise.all([
    getAuth().api.getSession({ headers: await headers() }),
    getProjectById(projectId),
    occurrenceId
      ? getRemarksByOccurrenceId(occurrenceId, noticeId)
      : getRemarksByNoticeId(noticeId),
  ]);

  const userId = session?.user?.id ?? "";
  const userName = session?.user?.name ?? "User";
  const userImage = session?.user?.image ?? null;

  const autolinkCtx: AutolinkContext = {
    repoUrl: project?.repo_url ?? null,
    repoIssueTracker: project?.repo_issue_tracker ?? null,
  };

  const noticeRemarks = remarks.filter((r) => r.occurrence_id === null);
  const occurrenceRemarks = occurrenceId
    ? remarks.filter((r) => r.occurrence_id !== null)
    : [];

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <RemarkGroup
        remarks={noticeRemarks}
        title={occurrenceId ? "Notice remarks" : undefined}
        currentUserId={userId}
        autolinkCtx={autolinkCtx}
      />
      <RemarkGroup
        remarks={occurrenceRemarks}
        title={noticeRemarks.length > 0 ? "Occurrence remarks" : undefined}
        currentUserId={userId}
        autolinkCtx={autolinkCtx}
      />

      {/* Empty state */}
      {remarks.length === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No remarks yet</EmptyTitle>
            <EmptyDescription>
              Add a remark to share investigation notes.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {/* Input form */}
      <Separator />
      <div>
        <RemarkForm
          noticeId={noticeId}
          occurrenceId={occurrenceId}
          userName={userName}
          userImage={userImage}
        />
      </div>
    </div>
  );
}
