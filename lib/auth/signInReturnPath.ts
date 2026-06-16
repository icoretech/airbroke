export const SIGN_IN_RETURN_PATH_COOKIE_NAME = "airbroke-signin-return";
export const SIGN_IN_RETURN_PATH_COOKIE_MAX_AGE_SECONDS = 300;

export function safeRelativeReturnPath(value: string | undefined): string {
  if (value?.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  return "/projects";
}
