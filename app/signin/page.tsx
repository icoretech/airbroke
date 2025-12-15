// app/signin/page.tsx

import { redirect } from "next/navigation";
import { auth, getSerializedProviders } from "@/lib/auth";
import SignInPageClient from "./SignInPageClient";

export default async function SignInPage() {
  const session = await auth();
  if (session) {
    redirect("/projects");
  }

  const providers = await getSerializedProviders();

  return <SignInPageClient providers={providers} />;
}
