// components/project/ProjectTopbarEndSlot.tsx

"use client";

import { List } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { EditProjectButton } from "@/components/project/EditProjectButton";
import { Button } from "@/components/ui/button";
import type { Route } from "next";

export function ProjectTopbarEndSlot({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const isEditPage = pathname.endsWith(`/projects/${projectId}/edit`);

  if (!isEditPage) return <EditProjectButton projectId={projectId} />;

  const href = `/projects/${projectId}` as Route;
  return (
    <Button
      asChild
      className="inline-flex items-center gap-2 btn-gradient shadow-xs focus-visible:ring-1 focus-visible:ring-offset-0"
    >
      <Link href={href} prefetch={false} aria-label="Show notices">
        <List />
        Show Notices
      </Link>
    </Button>
  );
}
