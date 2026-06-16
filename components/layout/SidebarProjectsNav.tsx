"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { TbBookmarks, TbClockPause, TbFileDelta } from "react-icons/tb";
import { SourceRepoProviderIcon } from "@/components/common/SourceRepoProviderIcon";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export type SidebarProjectItem = {
  id: string;
  name: string;
  paused: boolean;
  repoProvider: string;
  noticesCount: string;
};

export type SidebarProjectsGroup = {
  organization: string;
  projects: SidebarProjectItem[];
};

export const SIDEBAR_SCROLL_STORAGE_KEY = "airbroke:sidebar:scroll-top";
export const SIDEBAR_GROUPS_STORAGE_KEY = "airbroke:sidebar:groups-open";
const SIDEBAR_CONTENT_ID = "airbroke-sidebar-content";
const SIDEBAR_GROUPS_CHANGED_EVENT = "airbroke:sidebar:groups-changed";
const SCROLL_PERSISTENCE_NAVIGATION_LOCK_MS = 1200;
const EMPTY_OPEN_GROUPS: Record<string, boolean> = {};
let cachedOpenGroupsRaw: string | null = null;
let cachedOpenGroupsSnapshot: Record<string, boolean> = EMPTY_OPEN_GROUPS;

function readStoredOpenGroups(): Record<string, boolean> {
  if (typeof window === "undefined") {
    return EMPTY_OPEN_GROUPS;
  }

  try {
    const raw = window.sessionStorage.getItem(SIDEBAR_GROUPS_STORAGE_KEY);
    if (raw === cachedOpenGroupsRaw) {
      return cachedOpenGroupsSnapshot;
    }

    cachedOpenGroupsRaw = raw;
    if (!raw) {
      cachedOpenGroupsSnapshot = EMPTY_OPEN_GROUPS;
      return cachedOpenGroupsSnapshot;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      cachedOpenGroupsSnapshot = EMPTY_OPEN_GROUPS;
      return cachedOpenGroupsSnapshot;
    }

    const result: Record<string, boolean> = {};
    for (const [org, isOpen] of Object.entries(parsed)) {
      if (typeof isOpen === "boolean") {
        result[org] = isOpen;
      }
    }
    cachedOpenGroupsSnapshot = result;
    return cachedOpenGroupsSnapshot;
  } catch {
    cachedOpenGroupsSnapshot = EMPTY_OPEN_GROUPS;
    return cachedOpenGroupsSnapshot;
  }
}

function writeStoredOpenGroups(openGroups: Record<string, boolean>): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(
      SIDEBAR_GROUPS_STORAGE_KEY,
      JSON.stringify(openGroups),
    );
    window.dispatchEvent(new Event(SIDEBAR_GROUPS_CHANGED_EVENT));
  } catch {
    // Ignore storage write failures.
  }
}

function subscribeToStoredOpenGroups(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === SIDEBAR_GROUPS_STORAGE_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(SIDEBAR_GROUPS_CHANGED_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(SIDEBAR_GROUPS_CHANGED_EVENT, onStoreChange);
  };
}

function normalizeOpenGroups(
  organizations: string[],
  openGroups: Record<string, boolean>,
): Record<string, boolean> {
  const normalized: Record<string, boolean> = {};
  for (const organization of organizations) {
    normalized[organization] = openGroups[organization] ?? true;
  }
  return normalized;
}

function hasAnchorTarget(eventTarget: EventTarget | null): boolean {
  return (
    eventTarget instanceof Element && eventTarget.closest("a[href]") !== null
  );
}

function getSidebarContentElement(): HTMLDivElement | null {
  if (typeof window === "undefined") {
    return null;
  }

  const contentElement = document.getElementById(SIDEBAR_CONTENT_ID);
  return contentElement instanceof HTMLDivElement ? contentElement : null;
}

function persistScrollPosition(): void {
  if (typeof window === "undefined") {
    return;
  }

  const contentElement = getSidebarContentElement();
  if (!contentElement) {
    return;
  }

  try {
    window.sessionStorage.setItem(
      SIDEBAR_SCROLL_STORAGE_KEY,
      String(contentElement.scrollTop),
    );
  } catch {
    // Ignore storage write failures.
  }
}

export function SidebarProjectsNav({
  groupedProjects,
  selectedProjectId,
  activeSection,
}: {
  groupedProjects: SidebarProjectsGroup[];
  selectedProjectId?: string;
  activeSection?: "projects" | "bookmarks";
}) {
  const organizations = groupedProjects.map((group) => group.organization);
  const storedOpenGroups = useSyncExternalStore(
    subscribeToStoredOpenGroups,
    readStoredOpenGroups,
    () => EMPTY_OPEN_GROUPS,
  );
  const openGroups = normalizeOpenGroups(organizations, storedOpenGroups);
  const navigationLockUntilRef = useRef(0);

  const lockScrollPersistenceForNavigation = () => {
    navigationLockUntilRef.current =
      Date.now() + SCROLL_PERSISTENCE_NAVIGATION_LOCK_MS;
    persistScrollPosition();
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const contentElement = getSidebarContentElement();
    if (!contentElement) {
      return;
    }

    try {
      const storedScroll = window.sessionStorage.getItem(
        SIDEBAR_SCROLL_STORAGE_KEY,
      );
      const parsedScroll = Number(storedScroll);
      if (Number.isFinite(parsedScroll) && parsedScroll >= 0) {
        contentElement.scrollTop = parsedScroll;
      }
    } catch {
      // Ignore storage read failures.
    }

    const onScroll = () => {
      if (Date.now() < navigationLockUntilRef.current) {
        return;
      }
      persistScrollPosition();
    };

    contentElement.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      contentElement.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <SidebarContent
      id={SIDEBAR_CONTENT_ID}
      className="scrollbar-none"
      onPointerDownCapture={(event) => {
        if (hasAnchorTarget(event.target)) {
          lockScrollPersistenceForNavigation();
        }
      }}
      onClickCapture={(event) => {
        if (hasAnchorTarget(event.target)) {
          lockScrollPersistenceForNavigation();
        }
      }}
    >
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={!selectedProjectId && activeSection !== "bookmarks"}
              >
                <Link href="/projects" prefetch={false}>
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
                <Link href="/bookmarks" prefetch={false}>
                  <TbBookmarks />
                  <span>Bookmarks</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {groupedProjects.map(({ organization, projects }) => (
        <Collapsible
          key={organization}
          open={openGroups[organization] ?? true}
          onOpenChange={(isOpen) =>
            writeStoredOpenGroups({ ...openGroups, [organization]: isOpen })
          }
          className="group/collapsible"
        >
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group/label text-xs font-semibold text-sidebar-foreground/70"
            >
              <CollapsibleTrigger className="flex w-full items-center">
                {organization}
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {projects.map((project) => (
                    <SidebarMenuItem key={project.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={project.id === selectedProjectId}
                      >
                        <Link href={`/projects/${project.id}`} prefetch={false}>
                          {project.paused ? (
                            <TbClockPause />
                          ) : (
                            <SourceRepoProviderIcon
                              sourceRepoProvider={project.repoProvider}
                            />
                          )}
                          <span className="truncate">{project.name}</span>
                          {project.noticesCount !== "0" && (
                            <span className="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-background px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-foreground/90 ring-1 ring-inset ring-white/15">
                              {project.noticesCount}
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
  );
}
