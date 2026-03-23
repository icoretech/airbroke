// app/signin/page.tsx
//
// No auth runtime import here — the proxy handles redirecting authenticated
// users to /projects, so this page only needs the provider list.

import { getSerializedProviders } from "@/lib/auth-providers";
import SignInPageClient from "./SignInPageClient";

export default function SignInPage() {
  const providers = getSerializedProviders();

  return <SignInPageClient providers={providers} />;
}
