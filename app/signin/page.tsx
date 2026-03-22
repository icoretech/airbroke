// app/signin/page.tsx

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, getSerializedProviders } from "@/lib/auth";
import SignInPageClient from "./SignInPageClient";

export default async function SignInPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect("/projects");
  }

  const providers = await getSerializedProviders();

  return <SignInPageClient providers={providers} />;
}
