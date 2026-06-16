import { useSyncExternalStore } from "react";

const MOBILE_BREAKPOINT = 768;

function getIsMobileSnapshot(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.innerWidth < MOBILE_BREAKPOINT;
}

function subscribeToMobileBreakpoint(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const mediaQuery = window.matchMedia(
    `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
  );
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

export function useIsMobile() {
  return useSyncExternalStore(
    subscribeToMobileBreakpoint,
    getIsMobileSnapshot,
    () => false,
  );
}
