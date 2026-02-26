// components/AppShell.tsx

import Image from "next/image";
import Link from "next/link";
import { NavUser } from "@/components/NavUser";
import CreateProjectDialog from "@/components/project/CreateProjectDialog";
import { SidebarProjectsNav } from "@/components/SidebarProjectsNav";
import TopbarSearch from "@/components/TopbarSearch";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { getProjectsGroupedByOrganization } from "@/lib/queries/projects";
import logoAsset from "@/public/logo.svg";
import type { SidebarProjectsGroup } from "@/components/SidebarProjectsNav";

export async function AppShell({
  children,
  selectedProjectId,
  activeSection,
  topbarEndSlot,
  topbarSearchPlaceholder,
  topbarBreadcrumbs,
  topbarHideSearch,
}: {
  children: React.ReactNode;
  selectedProjectId?: string;
  activeSection?: "projects" | "bookmarks";
  topbarEndSlot?: React.ReactNode;
  topbarSearchPlaceholder?: string;
  topbarBreadcrumbs?: React.ReactNode;
  topbarHideSearch?: boolean;
}) {
  const session = await auth();
  const user = session?.user;
  const grouped = await getProjectsGroupedByOrganization();
  const groupedProjects: SidebarProjectsGroup[] = Object.entries(grouped).map(
    ([organization, projects]) => ({
      organization,
      projects: projects.map((project) => ({
        id: project.id,
        name: project.name,
        paused: project.paused,
        repoProvider: project.repo_provider ?? "",
        noticesCount: project.notices_count.toString(),
      })),
    }),
  );

  return (
    <SidebarProvider>
      <Sidebar collapsible="offcanvas" variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link
                  href="/"
                  prefetch={false}
                  aria-label="Airbroke home"
                  className="flex items-center gap-2"
                >
                  <Image
                    src={logoAsset}
                    alt="Airbroke"
                    width={32}
                    height={32}
                    className="rounded"
                  />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Airbroke</span>
                    <span className="truncate text-xs">Error Tracker</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarProjectsNav
          groupedProjects={groupedProjects}
          selectedProjectId={selectedProjectId}
          activeSection={activeSection}
        />

        <SidebarFooter>
          {(() => {
            const withImage = user as { image?: string | null } | undefined;
            const avatar = withImage?.image ?? "";
            return (
              <NavUser
                user={{
                  name: user?.name ?? "User",
                  email: user?.email ?? "",
                  avatar,
                }}
              />
            );
          })()}
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <div className="flex-1 min-w-0 overflow-hidden pr-2">
              {topbarBreadcrumbs}
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-4 lg:gap-6">
              {!topbarHideSearch && (
                <div className="hidden md:block max-w-[40vw]">
                  <TopbarSearch placeholder={topbarSearchPlaceholder} />
                </div>
              )}
              {topbarEndSlot ?? <CreateProjectDialog />}
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
