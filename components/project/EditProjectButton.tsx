"use client";

import { Pencil } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function EditProjectButton({ projectId }: { projectId: string }) {
  return (
    <Link
      href={`/projects/${projectId}/edit`}
      prefetch={false}
      aria-label="Edit project"
      className={buttonVariants({
        className:
          "inline-flex items-center gap-2 btn-gradient shadow-xs focus-visible:ring-1 focus-visible:ring-offset-0",
      })}
    >
      <Pencil className="mr-2 size-4" /> Edit Project
    </Link>
  );
}
