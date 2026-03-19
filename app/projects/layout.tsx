// app/projects/layout.tsx

export default function ProjectsLayout({ children }: LayoutProps<"/projects">) {
  // Pass-through layout to avoid nesting AppShell twice under /projects/[project_id]
  return children;
}
