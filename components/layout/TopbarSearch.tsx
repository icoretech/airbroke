"use client";

import { Loader2, Search as SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore, useTransition } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { generateUpdatedURL } from "@/lib/routing/generateUpdatedUrl";
import type { ChangeEvent, FormEvent } from "react";

type TopbarSearchProps = {
  isDisabled?: boolean;
  placeholder?: string;
};

type NavigatorWithUserAgentData = Navigator & {
  userAgentData?: { platform?: string };
};

function subscribeToPlatform(): () => void {
  return () => undefined;
}

function getPlatformSnapshot(): string {
  if (typeof navigator === "undefined") {
    return "";
  }

  const nav = navigator as NavigatorWithUserAgentData;
  return nav.userAgentData?.platform ?? navigator.platform ?? "";
}

function clearDebounceTimer(ref: { current: NodeJS.Timeout | null }): void {
  if (ref.current) clearTimeout(ref.current);
  ref.current = null;
}

function TopbarSearchImpl({
  isDisabled = false,
  placeholder = "Search...",
}: TopbarSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();
  const current = searchParams.get("searchQuery") ?? "";

  return (
    <TopbarSearchForm
      key={current}
      current={current}
      isDisabled={isDisabled}
      isPending={isPending}
      placeholder={placeholder}
      pushQuery={(value) => {
        const updated = generateUpdatedURL(pathname, searchParams, {
          searchQuery: value,
        });
        startTransition(() => router.push(updated));
      }}
    />
  );
}

function TopbarSearchForm({
  current,
  isDisabled,
  isPending,
  placeholder,
  pushQuery,
}: {
  current: string;
  isDisabled: boolean;
  isPending: boolean;
  placeholder: string;
  pushQuery(value: string): void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const platform = useSyncExternalStore(
    subscribeToPlatform,
    getPlatformSnapshot,
    () => "",
  );
  const isMac = /Mac|iPhone|iPod|iPad/i.test(platform);

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

  useEffect(() => () => clearDebounceTimer(debounceRef), []);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    clearDebounceTimer(debounceRef);
    const next = e.target.value;
    if (next === "") {
      pushQuery("");
    } else {
      debounceRef.current = setTimeout(() => pushQuery(next), 400);
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    clearDebounceTimer(debounceRef);
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
          defaultValue={current}
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

export default function TopbarSearch(props: TopbarSearchProps) {
  const pathname = usePathname();
  const isUnsupported =
    (pathname.startsWith("/projects/") && pathname.endsWith("/edit")) ||
    pathname.startsWith("/occurrences/");

  if (isUnsupported) return null;

  return <TopbarSearchImpl {...props} />;
}
