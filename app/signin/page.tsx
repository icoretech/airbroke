// app/signin/page.tsx
//
// No auth runtime import here — the proxy handles redirecting authenticated
// users to /projects, so this page only needs the provider list.

import { cookies } from "next/headers";
import { connection } from "next/server";
import { getSerializedProviders } from "@/lib/auth-providers";
import {
  SIGN_IN_RETURN_PATH_COOKIE_NAME,
  safeRelativeReturnPath,
} from "@/lib/signInReturnPath";
import SignInPageClient from "./SignInPageClient";

export default async function SignInPage(props: PageProps<"/signin">) {
  await connection();
  const [providers, searchParams, cookieStore] = await Promise.all([
    getSerializedProviders(),
    props.searchParams,
    cookies(),
  ]);
  const callbackUrl = safeRelativeReturnPath(
    cookieStore.get(SIGN_IN_RETURN_PATH_COOKIE_NAME)?.value,
  );
  const showError = Boolean(searchParams.error);

  return (
    <SignInPageClient
      providers={providers}
      callbackUrl={callbackUrl}
      showError={showError}
    />
  );
}
