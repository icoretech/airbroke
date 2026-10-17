// components/AppShell.tsx

import Image from "next/image";
import Link from "next/link";
import { NavUser } from "@/components/layout/NavUser";
import { SidebarProjectsNav } from "@/components/layout/SidebarProjectsNav";
import TopbarSearch from "@/components/layout/TopbarSearch";
import CreateProjectDialog from "@/components/project/CreateProjectDialog";
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
import { requireSession } from "@/lib/auth/requireSession";
import { getProjectsGroupedByOrganization } from "@/lib/queries/projects";
import logoAsset from "@/public/logo.svg";
import type { SidebarProjectsGroup } from "@/components/layout/SidebarProjectsNav";

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
  const session = await requireSession();
  const user = session.user;
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
              <SidebarMenuButton
                size="lg"
                render={
                  <Link
                    href="/"
                    prefetch={false}
                    aria-label="Airbroke home"
                    className="flex items-center gap-2"
                  />
                }
              >
                <Image
                  src={logoAsset}
                  alt="Airbroke"
                  width={32}
                  height={32}
                  className="size-8 rounded"
                  style={{ width: "32px", height: "32px" }}
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Airbroke</span>
                  <span className="truncate text-xs">Error Tracker</span>
                </div>
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

      <SidebarInset className="min-w-0">
        <header className="flex shrink-0 items-center gap-2">
          <div className="flex min-h-16 w-full flex-wrap items-center gap-2 px-4 py-3 lg:flex-nowrap lg:py-0">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-center"
            />
            <div className="flex-1 min-w-0 overflow-hidden pr-2">
              {topbarBreadcrumbs}
            </div>
            {!topbarHideSearch && (
              <div className="order-last w-full min-w-0 empty:hidden [&>form]:max-w-none lg:order-none lg:w-64 lg:max-w-[40vw]">
                <TopbarSearch placeholder={topbarSearchPlaceholder} />
              </div>
            )}
            <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-4 lg:gap-6">
              {topbarEndSlot ?? <CreateProjectDialog />}
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
