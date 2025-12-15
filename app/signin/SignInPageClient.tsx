// app/signin/SignInPageClient.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn as nextAuthSignIn } from "next-auth/react";
import { useState } from "react";
import {
  FaApple,
  FaBitbucket,
  FaGithub,
  FaGitlab,
  FaGoogle,
  FaSlack,
} from "react-icons/fa";
import {
  SiAmazoncognito,
  SiAuthentik,
  SiKeycloak,
  SiOkta,
} from "react-icons/si";
import { SlDisc } from "react-icons/sl";
import { VscAzure } from "react-icons/vsc";
import FooterCredits from "@/components/FooterCredits";
import PageBackground from "@/components/PageBackground";
import { Button } from "@/components/ui/button";
import logo from "@/public/logo.svg";

const providerIcons: Record<string, React.ElementType> = {
  github: FaGithub,
  atlassian: FaBitbucket,
  google: FaGoogle,
  gitlab: FaGitlab,
  keycloak: SiKeycloak,
  "microsoft-entra-id": VscAzure,
  apple: FaApple,
  authentik: SiAuthentik,
  slack: FaSlack,
  okta: SiOkta,
  cognito: SiAmazoncognito,
};

type ProviderInfo = {
  id: string;
  name: string;
};

interface SignInPageClientProps {
  providers: ProviderInfo[];
}

export default function SignInPageClient({ providers }: SignInPageClientProps) {
  const [signingInProvider, setSigningInProvider] = useState<string | null>(
    null,
  );

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/projects";
  const error = searchParams.get("error");
  const showError = Boolean(error);

  const handleSignIn = (providerId: string) => {
    setSigningInProvider(providerId);
    nextAuthSignIn(providerId, { callbackUrl: callbackUrl });
  };

  return (
    <main className="relative min-h-screen">
      <PageBackground>
        <div className="mx-auto flex min-h-screen w-full items-center justify-center px-4 py-16">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-5 flex flex-col items-center gap-2 text-center">
              <Link href="/">
                <Image
                  src={logo}
                  alt="Airbroke"
                  className="h-10 w-auto"
                  height={338}
                  width={463}
                />
              </Link>
              <h1 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                Sign in to Airbroke
              </h1>
              <p className="text-xs text-gray-300">Choose a provider below.</p>
            </div>

            {/* Card */}
            <div className="overflow-hidden rounded-xl border border-white/10 bg-airbroke-800/80 p-5 shadow-sm ring-1 ring-white/5 backdrop-blur sm:p-6">
              {showError && (
                <div className="mb-4 rounded-md border border-red-700 bg-red-800/90 p-2 text-red-100">
                  Sign-in error: {error}.
                </div>
              )}

              {/* Provider Buttons (login6-style stack) */}
              <div className="space-y-3">
                {providers.map((provider) => {
                  const Icon = providerIcons[provider.id];
                  const isThisButtonSigningIn =
                    signingInProvider === provider.id;
                  return (
                    <Button
                      key={provider.id}
                      type="button"
                      onClick={() => handleSignIn(provider.id)}
                      disabled={Boolean(signingInProvider)}
                      className="w-full"
                    >
                      {isThisButtonSigningIn ? (
                        <SlDisc className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        Icon && <Icon className="mr-2 h-5 w-5" />
                      )}
                      <span>Sign in with {provider.name}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Link after form */}
            <p className="mt-3 text-center text-xs text-gray-300">
              <Link href="/" className="text-indigo-300 hover:underline">
                Go to homepage
              </Link>
            </p>
            {/* Footer */}
            <p className="mt-4 text-center text-xs text-gray-400">
              <FooterCredits />
            </p>
          </div>
        </div>
      </PageBackground>
    </main>
  );
}
