// app/projects/[project_id]/edit/layout.tsx
// Pass-through layout to avoid rendering AppShell twice under /projects/[project_id]/edit
// The parent layout at app/projects/[project_id]/layout.tsx already wraps pages with AppShell.
import type { ReactNode } from "react";

export default function ProjectEditLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
