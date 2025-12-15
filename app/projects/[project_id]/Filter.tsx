// app/projects/[project_id]/Filter.tsx

"use client";

import { Filter } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import EnvironmentLabel from "@/components/EnvironmentLabel";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { generateUpdatedURLWithRemovals } from "@/lib/generateUpdatedUrlWithRemovals";

export default function EnvironmentFilter({
  environments,
}: {
  environments: string[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { filterByEnv } = Object.fromEntries(searchParams) as {
    filterByEnv?: string;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Filter by environment">
          <Filter className="mr-2 size-4" />
          {filterByEnv && filterByEnv !== "" ? (
            <span className="flex items-center gap-2">
              <span className="hidden sm:inline">Environment:</span>
              <EnvironmentLabel
                env={filterByEnv}
                className="py-0.5 text-[10px] sm:text-xs"
              />
            </span>
          ) : (
            <span>Environment: All</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Filter by environment</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={filterByEnv ?? ""}>
          <DropdownMenuRadioItem value="">
            <Link
              href={generateUpdatedURLWithRemovals(pathname, searchParams, {}, [
                "filterByEnv",
              ])}
              className="flex w-full"
            >
              All environments
            </Link>
          </DropdownMenuRadioItem>
          {environments.map((env) => (
            <DropdownMenuRadioItem key={env} value={env}>
              <Link
                href={generateUpdatedURLWithRemovals(pathname, searchParams, {
                  filterByEnv: env,
                })}
                className="flex w-full"
              >
                {env}
              </Link>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={generateUpdatedURLWithRemovals(pathname, searchParams, {}, [
              "filterByEnv",
            ])}
            className="flex w-full"
          >
            Clear filter
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
