"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TbBookmarks, TbClockPause, TbFileDelta } from "react-icons/tb";
import { SourceRepoProviderIcon } from "@/components/SourceRepoProviderIcon";
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
const SCROLL_PERSISTENCE_NAVIGATION_LOCK_MS = 1200;

function readStoredOpenGroups(): Record<string, boolean> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.sessionStorage.getItem(SIDEBAR_GROUPS_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    const result: Record<string, boolean> = {};
    for (const [org, isOpen] of Object.entries(parsed)) {
      if (typeof isOpen === "boolean") {
        result[org] = isOpen;
      }
    }
    return result;
  } catch {
    return {};
  }
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

function haveSameGroupState(
  left: Record<string, boolean>,
  right: Record<string, boolean>,
): boolean {
  const leftEntries = Object.entries(left);
  const rightEntries = Object.entries(right);
  if (leftEntries.length !== rightEntries.length) {
    return false;
  }
  for (const [organization, isOpen] of leftEntries) {
    if (right[organization] !== isOpen) {
      return false;
    }
  }
  return true;
}

function hasAnchorTarget(eventTarget: EventTarget | null): boolean {
  return (
    eventTarget instanceof Element && eventTarget.closest("a[href]") !== null
  );
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
  const organizations = useMemo(
    () => groupedProjects.map((group) => group.organization),
    [groupedProjects],
  );

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    return normalizeOpenGroups(organizations, {});
  });
  const [hasRestoredOpenGroups, setHasRestoredOpenGroups] = useState(false);
  const navigationLockUntilRef = useRef(0);

  useEffect(() => {
    setOpenGroups((current) => {
      const normalized = normalizeOpenGroups(organizations, current);
      return haveSameGroupState(current, normalized) ? current : normalized;
    });
  }, [organizations]);

  useEffect(() => {
    setOpenGroups((current) => {
      const storedOpenGroups = readStoredOpenGroups();
      const restored = normalizeOpenGroups(
        Object.keys(current),
        storedOpenGroups,
      );
      return haveSameGroupState(current, restored) ? current : restored;
    });
    setHasRestoredOpenGroups(true);
  }, []);

  useEffect(() => {
    if (!hasRestoredOpenGroups) {
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    try {
      window.sessionStorage.setItem(
        SIDEBAR_GROUPS_STORAGE_KEY,
        JSON.stringify(openGroups),
      );
    } catch {
      // Ignore storage write failures.
    }
  }, [openGroups, hasRestoredOpenGroups]);

  const getSidebarContentElement = useCallback(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const contentElement = document.getElementById(SIDEBAR_CONTENT_ID);
    return contentElement instanceof HTMLDivElement ? contentElement : null;
  }, []);

  const persistScrollPosition = useCallback(() => {
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
  }, [getSidebarContentElement]);

  const lockScrollPersistenceForNavigation = useCallback(() => {
    navigationLockUntilRef.current =
      Date.now() + SCROLL_PERSISTENCE_NAVIGATION_LOCK_MS;
    persistScrollPosition();
  }, [persistScrollPosition]);

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
  }, [persistScrollPosition, getSidebarContentElement]);

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
            setOpenGroups((current) => ({ ...current, [organization]: isOpen }))
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
