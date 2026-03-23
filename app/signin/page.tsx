// app/signin/page.tsx
//
// No auth runtime import here — the proxy handles redirecting authenticated
// users to /projects, so this page only needs the provider list.

import { connection } from "next/server";
import { getSerializedProviders } from "@/lib/auth-providers";
import SignInPageClient from "./SignInPageClient";

export default async function SignInPage() {
  await connection();
  const providers = getSerializedProviders();

  return <SignInPageClient providers={providers} />;
}
