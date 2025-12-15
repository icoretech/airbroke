"use client";

import { Pencil } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EditProjectButton({ projectId }: { projectId: string }) {
  return (
    <Button
      asChild
      className="inline-flex items-center gap-2 btn-gradient shadow-xs focus-visible:ring-1 focus-visible:ring-offset-0"
    >
      <Link
        href={`/projects/${projectId}/edit`}
        prefetch={false}
        aria-label="Edit project"
      >
        <Pencil className="mr-2 size-4" /> Edit Project
      </Link>
    </Button>
  );
}
