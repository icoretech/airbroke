// components/remark/RemarkForm.tsx

"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { createRemark, updateRemark } from "@/app/_actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface RemarkFormProps {
  noticeId: string;
  occurrenceId?: string;
  userName: string;
  userImage?: string | null;
  editRemarkId?: string;
  editInitialBody?: string;
  onCancelEdit?: () => void;
}

export default function RemarkForm({
  noticeId,
  occurrenceId,
  userName,
  userImage,
  editRemarkId,
  editInitialBody,
  onCancelEdit,
}: RemarkFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [body, setBody] = useState(editInitialBody ?? "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isEdit = Boolean(editRemarkId);

  function handleSubmit() {
    const trimmed = body.trim();
    if (!trimmed) return;

    const action =
      isEdit && editRemarkId
        ? updateRemark(editRemarkId, trimmed)
        : createRemark(noticeId, trimmed, occurrenceId);

    void action
      .then(() => {
        if (!isEdit) setBody("");
        onCancelEdit?.();
        startTransition(() => router.refresh());
      })
      .catch((error) => {
        console.error("Remark action failed:", error);
      });
  }

  return (
    <div className="flex gap-3">
      {!isEdit && (
        <Avatar className="size-8 shrink-0">
          {userImage ? <AvatarImage src={userImage} alt={userName} /> : null}
          <AvatarFallback className="text-xs">
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>
      )}
      <div className="flex-1">
        <Textarea
          ref={textareaRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a remark..."
          className="min-h-16 resize-y"
          disabled={isPending}
        />
        <div className="mt-2 flex items-center justify-end gap-2">
          {isEdit && onCancelEdit && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancelEdit}
              disabled={isPending}
            >
              Cancel
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={isPending || !body.trim()}
          >
            {isEdit ? "Save" : "Add remark"}
          </Button>
        </div>
      </div>
    </div>
  );
}
