export const SIGN_IN_RETURN_PATH_COOKIE_NAME = "airbroke-signin-return";
export const SIGN_IN_RETURN_PATH_COOKIE_MAX_AGE_SECONDS = 300;

export function isProtectedPagePath(pathname: string): boolean {
  return /^\/(projects|bookmarks|notices|occurrences)(\/|$)/.test(pathname);
}

export function safeRelativeReturnPath(value: string | undefined): string {
  if (
    !value?.startsWith("/") ||
    value.startsWith("//") ||
    /[\p{Cc}\\]/u.test(value)
  ) {
    return "/projects";
  }

  const url = new URL(value, "https://example.com");
  if (url.pathname === "/" || isProtectedPagePath(url.pathname)) {
    // Normalize traversal while preserving the original query and fragment.
    const suffixStart = value.search(/[?#]/);
    return url.pathname + (suffixStart === -1 ? "" : value.slice(suffixStart));
  }

  return "/projects";
}
