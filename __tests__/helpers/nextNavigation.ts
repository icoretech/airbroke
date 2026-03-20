export type ReadonlyURLSearchParams = URLSearchParams;

export function redirect(url: string): never {
  throw new Error(`redirect:${url}`);
}

export function notFound(): never {
  throw new Error("notFound");
}

export function unstable_rethrow(error: unknown): never {
  throw error instanceof Error ? error : new Error(String(error));
}

export function usePathname() {
  return "/";
}

export function useSearchParams() {
  return new URLSearchParams();
}

export function useRouter() {
  return {
    back() {},
    forward() {},
    prefetch() {
      return Promise.resolve();
    },
    push() {},
    refresh() {},
    replace() {},
  };
}
