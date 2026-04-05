// components/remark/RemarkThread.tsx

import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import { getProjectById } from "@/lib/queries/projects";
import {
  getRemarksByNoticeId,
  getRemarksByOccurrenceId,
} from "@/lib/queries/remarks";
import RemarkForm from "./RemarkForm";
import RemarkItem from "./RemarkItem";
import type { AutolinkContext } from "@/lib/autolink";

interface RemarkThreadProps {
  noticeId: string;
  occurrenceId?: string;
  projectId: string;
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
    <div className="p-4 sm:p-5">
      {/* Notice remarks section (on occurrence page) */}
      {occurrenceId && noticeRemarks.length > 0 && (
        <div className="mb-6">
          <div className="mb-3 border-b border-card/40 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Notice remarks
          </div>
          <div className="divide-y divide-card/40">
            {noticeRemarks.map((remark) => (
              <RemarkItem
                key={remark.id}
                remark={remark}
                currentUserId={userId}
                autolinkCtx={autolinkCtx}
              />
            ))}
          </div>
        </div>
      )}

      {/* Occurrence remarks section (on occurrence page) */}
      {occurrenceId && (
        <div className="mb-6">
          {noticeRemarks.length > 0 && (
            <div className="mb-3 border-b border-card/40 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Occurrence remarks
            </div>
          )}
          {occurrenceRemarks.length > 0 && (
            <div className="divide-y divide-card/40">
              {occurrenceRemarks.map((remark) => (
                <RemarkItem
                  key={remark.id}
                  remark={remark}
                  currentUserId={userId}
                  autolinkCtx={autolinkCtx}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Notice-only page: single section */}
      {!occurrenceId && noticeRemarks.length > 0 && (
        <div className="mb-6">
          <div className="divide-y divide-card/40">
            {noticeRemarks.map((remark) => (
              <RemarkItem
                key={remark.id}
                remark={remark}
                currentUserId={userId}
                autolinkCtx={autolinkCtx}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {remarks.length === 0 && (
        <p className="mb-6 text-sm text-muted-foreground">
          No remarks yet. Be the first to add one.
        </p>
      )}

      {/* Input form */}
      <div className="border-t border-card/40 pt-4">
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
