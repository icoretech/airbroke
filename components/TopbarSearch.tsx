"use client";

import { Loader2, Search as SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { generateUpdatedURL } from "@/lib/generateUpdatedUrl";
import type { ChangeEvent, FormEvent } from "react";

type TopbarSearchProps = {
  isDisabled?: boolean;
  placeholder?: string;
};

export default function TopbarSearch({
  isDisabled = false,
  placeholder = "Search...",
}: TopbarSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState("");
  const [isMac, setIsMac] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const current = searchParams.get("searchQuery") ?? "";

  useEffect(() => {
    if (!isPending) queueMicrotask(() => inputRef.current?.focus());
  }, [isPending]);

  // Keep local input state in sync with URL when it changes (e.g., Clear search)
  useEffect(() => {
    setValue(current);
  }, [current]);

  useEffect(() => {
    function isTypingInField(target: EventTarget | null) {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName.toLowerCase();
      return (
        tag === "input" ||
        tag === "textarea" ||
        (target as HTMLElement).isContentEditable
      );
    }
    function onKey(e: KeyboardEvent) {
      if (isTypingInField(e.target)) return;
      // Cmd+K or Ctrl+K focuses search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Slash focuses search (avoid forward slash being typed)
      if (!e.metaKey && !e.ctrlKey && e.key === "/") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Detect OS on client only to avoid SSR/CSR text mismatches
  useEffect(() => {
    type NavigatorUA = Navigator & { userAgentData?: { platform?: string } };
    const nav = navigator as NavigatorUA;
    const platform = nav.userAgentData?.platform ?? navigator.platform ?? "";
    setIsMac(/Mac|iPhone|iPod|iPad/i.test(platform));
  }, []);

  function pushQuery(value: string) {
    const updated = generateUpdatedURL(pathname, searchParams, {
      searchQuery: value,
    });
    startTransition(() => router.push(updated));
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const next = e.target.value;
    setValue(next);
    if (next === "") {
      pushQuery("");
    } else {
      debounceRef.current = setTimeout(() => pushQuery(next), 400);
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    pushQuery((fd.get("searchQuery") as string) ?? "");
  }

  const disabled = isDisabled || isPending;

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          {isPending ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          ) : (
            <SearchIcon className="size-4 text-muted-foreground" />
          )}
        </InputGroupAddon>
        <InputGroupInput
          ref={inputRef}
          name="searchQuery"
          type="search"
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={onChange}
          className=""
        />
        <InputGroupAddon align="inline-end">
          <KbdGroup suppressHydrationWarning>
            {isMac ? (
              <>
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </>
            ) : (
              <>
                <Kbd>Ctrl</Kbd>
                <Kbd>K</Kbd>
              </>
            )}
          </KbdGroup>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
