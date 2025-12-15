// app/projects/[project_id]/Sort.tsx

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
import { generateUpdatedURLWithRemovals } from "@/lib/generateUpdatedUrlWithRemovals";

type SortAttribute = "env" | "kind" | "updated_at" | "seen_count" | undefined;
type SortDirection = "asc" | "desc" | undefined;

const sortAttributes: Exclude<SortAttribute, undefined>[] = [
  "kind",
  "seen_count",
  "env",
  "updated_at",
];

export default function Sort() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { sortDir, sortAttr } = Object.fromEntries(searchParams) as {
    sortDir?: SortDirection;
    sortAttr?: SortAttribute;
  };

  // Defaults must mirror backend query defaults
  const DEFAULT_ATTR: Exclude<SortAttribute, undefined> = "updated_at";
  const DEFAULT_DIR: Exclude<SortDirection, undefined> = "desc";
  const effectiveAttr: Exclude<SortAttribute, undefined> = (sortAttr ??
    DEFAULT_ATTR) as Exclude<SortAttribute, undefined>;
  const effectiveDir: Exclude<SortDirection, undefined> = (sortDir ??
    DEFAULT_DIR) as Exclude<SortDirection, undefined>;

  function toggleSort(attr: Exclude<SortAttribute, undefined>): SortDirection {
    return effectiveAttr === attr && effectiveDir === "asc" ? "desc" : "asc";
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Sort notices">
          <ArrowUpDown className="mr-2 size-4" />
          <span className="flex items-center gap-1">
            Sort:
            <span className="capitalize">
              {(effectiveAttr as string).replace("_", " ")}
            </span>
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
          {sortAttributes.map((attr) => {
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
                  <span className="capitalize">{attr.replace("_", " ")}</span>
                </Link>
                {isActive && (
                  <DropdownMenuShortcut>
                    {(effectiveDir ?? "desc").toUpperCase()}
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
