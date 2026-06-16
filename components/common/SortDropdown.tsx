"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { generateUpdatedURLWithRemovals } from "@/lib/routing/generateUpdatedUrlWithRemovals";

type SortDirection = "asc" | "desc";

interface SortDropdownProps<T extends string> {
  readonly ariaLabel: string;
  readonly attributes: readonly T[];
  readonly defaultAttr: T;
  readonly defaultDir: SortDirection;
}

function findSortAttribute<T extends string>(
  value: string | null,
  attributes: readonly T[],
  defaultAttr: T,
): T {
  for (const attr of attributes) {
    if (attr === value) {
      return attr;
    }
  }

  return defaultAttr;
}

function parseSortDirection(
  value: string | null,
  defaultDir: SortDirection,
): SortDirection {
  return value === "asc" || value === "desc" ? value : defaultDir;
}

function sortLabel(value: string): string {
  return value.replace("_", " ");
}

export default function SortDropdown<T extends string>({
  ariaLabel,
  attributes,
  defaultAttr,
  defaultDir,
}: SortDropdownProps<T>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const effectiveAttr = findSortAttribute(
    searchParams.get("sortAttr"),
    attributes,
    defaultAttr,
  );
  const effectiveDir = parseSortDirection(
    searchParams.get("sortDir"),
    defaultDir,
  );

  function toggleSort(attr: T): SortDirection {
    return effectiveAttr === attr && effectiveDir === "asc" ? "desc" : "asc";
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" aria-label={ariaLabel}>
          <ArrowUpDown className="mr-2 size-4" />
          <span className="flex items-center gap-1">
            Sort:
            <span className="capitalize">{sortLabel(effectiveAttr)}</span>
            {effectiveDir === "asc" ? (
              <ArrowUp className="size-3.5" />
            ) : (
              <ArrowDown className="size-3.5" />
            )}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={effectiveAttr}>
          {attributes.map((attr) => {
            const nextDir = toggleSort(attr);
            const isActive = effectiveAttr === attr;
            return (
              <DropdownMenuRadioItem key={attr} value={attr}>
                <Link
                  href={generateUpdatedURLWithRemovals(pathname, searchParams, {
                    sortAttr: attr,
                    sortDir: nextDir,
                  })}
                  className="flex w-full items-center"
                >
                  <span className="capitalize">{sortLabel(attr)}</span>
                </Link>
                {isActive && (
                  <DropdownMenuShortcut>
                    {effectiveDir.toUpperCase()}
                  </DropdownMenuShortcut>
                )}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={generateUpdatedURLWithRemovals(pathname, searchParams, {}, [
              "sortAttr",
              "sortDir",
            ])}
            className="flex w-full"
          >
            Clear sorting
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
