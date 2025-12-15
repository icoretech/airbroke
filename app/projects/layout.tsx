// app/projects/layout.tsx
import type { ReactNode } from "react";

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  // Pass-through layout to avoid nesting AppShell twice under /projects/[project_id]
  return children;
}
