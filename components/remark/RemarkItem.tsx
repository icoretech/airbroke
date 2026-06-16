"use client";

import { useState } from "react";
import ClientMutationError from "@/components/common/ClientMutationError";
import CustomTimeAgo from "@/components/common/CustomTimeAgo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useClientMutation } from "@/hooks/useClientMutation";
import { deleteRemark } from "@/lib/actions/remarkActions";
import { autolink } from "@/lib/autolink";
import RemarkForm from "./RemarkForm";
import type { AutolinkContext } from "@/lib/autolink";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface RemarkItemProps {
  remark: {
    id: string;
    body: string;
    notice_id: string;
    occurrence_id: string | null;
    created_at: Date;
    user: {
      id: string;
      name: string;
      image: string | null;
    };
  };
  currentUserId: string;
  autolinkCtx: AutolinkContext;
}

export default function RemarkItem({
  remark,
  currentUserId,
  autolinkCtx,
}: RemarkItemProps) {
  const { errorMessage, isBusy, runMutation } = useClientMutation();
  const [isEditing, setIsEditing] = useState(false);

  const isOwn = remark.user.id === currentUserId;

  function handleDelete() {
    runMutation({
      action: () => deleteRemark(remark.id),
      errorMessage: "Could not delete remark",
    });
  }

  if (isEditing) {
    return (
      <div className="py-3">
        <RemarkForm
          noticeId={remark.notice_id}
          occurrenceId={remark.occurrence_id ?? undefined}
          userName={remark.user.name}
          userImage={remark.user.image}
          editRemarkId={remark.id}
          editInitialBody={remark.body}
          onCancelEdit={() => setIsEditing(false)}
        />
      </div>
    );
  }

  const lineCounts = new Map<string, number>();
  const bodyLines = remark.body.split("\n").map((line) => {
    const seenCount = lineCounts.get(line) ?? 0;
    lineCounts.set(line, seenCount + 1);
    return {
      key: seenCount === 0 ? line : `${line}-${seenCount + 1}`,
      text: line,
    };
  });

  return (
    <div className="flex gap-3 py-3">
      <Avatar className="size-8 shrink-0">
        {remark.user.image ? (
          <AvatarImage src={remark.user.image} alt={remark.user.name} />
        ) : null}
        <AvatarFallback className="text-xs">
          {getInitials(remark.user.name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-foreground">
            {remark.user.name}
          </span>
          <span className="text-xs text-muted-foreground">
            <CustomTimeAgo date={new Date(remark.created_at)} />
          </span>
          {isOwn && (
            <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
              <button
                type="button"
                className="hover:text-foreground"
                onClick={() => setIsEditing(true)}
                disabled={isBusy}
              >
                edit
              </button>
              <button
                type="button"
                className="hover:text-destructive"
                onClick={handleDelete}
                disabled={isBusy}
              >
                delete
              </button>
            </span>
          )}
        </div>
        <div className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {bodyLines.map((line, index) => (
            <span key={line.key}>
              {autolink(line.text, autolinkCtx)}
              {index < bodyLines.length - 1 && <br />}
            </span>
          ))}
        </div>
        <ClientMutationError className="mt-2" message={errorMessage} />
      </div>
    </div>
  );
}
