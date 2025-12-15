// components/AppShell.tsx

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TbBookmarks, TbClockPause, TbFileDelta } from "react-icons/tb";
import { NavUser } from "@/components/NavUser";
import CreateProjectDialog from "@/components/project/CreateProjectDialog";
import { SourceRepoProviderIcon } from "@/components/SourceRepoProviderIcon";
import TopbarSearch from "@/components/TopbarSearch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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

  return (
    <SidebarProvider>
      <Sidebar collapsible="offcanvas" variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link
                  href="/"
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

        <SidebarContent>
          {/* Primary links */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      !selectedProjectId && activeSection !== "bookmarks"
                    }
                  >
                    <Link href="/projects">
                      <TbFileDelta />
                      <span>Projects</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={activeSection === "bookmarks"}
                  >
                    <Link href="/bookmarks">
                      <TbBookmarks />
                      <span>Bookmarks</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Organizations and Projects */}
          {Object.entries(grouped).map(([org, projects]) => (
            <Collapsible key={org} defaultOpen className="group/collapsible">
              <SidebarGroup>
                <SidebarGroupLabel
                  asChild
                  className="group/label text-xs font-semibold text-sidebar-foreground/70"
                >
                  <CollapsibleTrigger className="flex w-full items-center">
                    {org}
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {projects.map((p) => (
                        <SidebarMenuItem key={p.id}>
                          <SidebarMenuButton
                            asChild
                            isActive={p.id === selectedProjectId}
                          >
                            <Link
                              href={`/projects/${p.id}`}
                              className="transition-all duration-100 ease-out will-change-transform hover:scale-105"
                            >
                              {p.paused ? (
                                <TbClockPause />
                              ) : (
                                <SourceRepoProviderIcon
                                  sourceRepoProvider={p.repo_provider}
                                />
                              )}
                              <span className="truncate">{p.name}</span>
                              {p.notices_count > 0 && (
                                <span className="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-background px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-foreground/90 ring-1 ring-inset ring-white/15">
                                  {p.notices_count.toString()}
                                </span>
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          ))}
        </SidebarContent>

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
