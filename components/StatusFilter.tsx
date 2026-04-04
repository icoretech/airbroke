// components/StatusFilter.tsx

"use client";

import { CircleDot } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { generateUpdatedURLWithRemovals } from "@/lib/generateUpdatedUrlWithRemovals";

const STATUS_OPTIONS = [
  { value: "unresolved", label: "Unresolved" },
  { value: "resolved", label: "Resolved" },
  { value: "all", label: "All" },
] as const;

type StatusValue = (typeof STATUS_OPTIONS)[number]["value"];

interface StatusFilterProps {
  defaultStatus?: StatusValue;
}

export default function StatusFilter({
  defaultStatus = "unresolved",
}: StatusFilterProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStatus =
    (searchParams.get("status") as StatusValue | null) ?? defaultStatus;

  const currentLabel =
    STATUS_OPTIONS.find((o) => o.value === currentStatus)?.label ??
    "Unresolved";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Filter by status">
          <CircleDot className="mr-2 size-4" />
          <span>Status: {currentLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={currentStatus}>
          {STATUS_OPTIONS.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              <Link
                href={
                  option.value === defaultStatus
                    ? generateUpdatedURLWithRemovals(
                        pathname,
                        searchParams,
                        {},
                        ["status"],
                      )
                    : generateUpdatedURLWithRemovals(pathname, searchParams, {
                        status: option.value,
                      })
                }
                className="flex w-full"
              >
                {option.label}
              </Link>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
