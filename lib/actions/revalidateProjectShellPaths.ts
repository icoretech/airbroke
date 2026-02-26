import { revalidatePath } from "next/cache";

export function revalidateProjectsSidebarPaths() {
  revalidatePath("/projects");
  revalidatePath("/bookmarks");
}

export function revalidateProjectShellPaths(projectId: string) {
  revalidateProjectsSidebarPaths();
  revalidatePath(`/projects/${projectId}`, "layout");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/projects/${projectId}/edit`);
}
