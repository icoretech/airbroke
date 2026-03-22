// app/signin/SignInPageClient.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  FaApple,
  FaAws,
  FaBitbucket,
  FaGithub,
  FaGitlab,
  FaGoogle,
  FaSalesforce,
  FaSlack,
} from "react-icons/fa";
import {
  SiAtlassian,
  SiAuth0,
  SiAuthentik,
  SiFusionauth,
  SiKeycloak,
  SiOkta,
} from "react-icons/si";
import { SlDisc } from "react-icons/sl";
import { TbAlertTriangle, TbShieldLock } from "react-icons/tb";
import { VscAzure } from "react-icons/vsc";
import FooterCredits from "@/components/FooterCredits";
import PageBackground from "@/components/PageBackground";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import logo from "@/public/logo.svg";

const providerIcons: Record<string, React.ElementType> = {
  github: FaGithub,
  atlassian: SiAtlassian,
  auth0: SiAuth0,
  google: FaGoogle,
  gitlab: FaGitlab,
  bitbucket: FaBitbucket,
  "boxyhq-saml": TbShieldLock,
  keycloak: SiKeycloak,
  microsoft: VscAzure,
  apple: FaApple,
  authentik: SiAuthentik,
  slack: FaSlack,
  okta: SiOkta,
  cognito: FaAws,
  salesforce: FaSalesforce,
  fusionauth: SiFusionauth,
};

type ProviderInfo = {
  id: string;
  name: string;
  type: "social" | "oauth2";
};

interface SignInPageClientProps {
  providers: ProviderInfo[];
}

export default function SignInPageClient({ providers }: SignInPageClientProps) {
  const [signingInProvider, setSigningInProvider] = useState<string | null>(
    null,
  );

  // Reset disabled state when the page is restored from bfcache (browser back).
  const resetState = useCallback(() => {
    setSigningInProvider(null);
  }, []);

  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) resetState();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [resetState]);

  const searchParams = useSearchParams();
  const rawCallback = searchParams.get("callbackUrl") ?? "/projects";
  const callbackUrl =
    rawCallback.startsWith("/") && !rawCallback.startsWith("//")
      ? rawCallback
      : "/projects";
  const error = searchParams.get("error");
  const showError = Boolean(error);

  const [signInError, setSignInError] = useState<string | null>(null);

  const handleSignIn = async (provider: ProviderInfo) => {
    setSigningInProvider(provider.id);
    setSignInError(null);

    try {
      const result =
        provider.type === "social"
          ? await authClient.signIn.social({
              provider: provider.id as
                | "github"
                | "google"
                | "apple"
                | "gitlab"
                | "slack"
                | "salesforce"
                | "microsoft",
              callbackURL: callbackUrl,
            })
          : await authClient.signIn.oauth2({
              providerId: provider.id,
              callbackURL: callbackUrl,
            });

      if (result?.error) {
        const msg = result.error.message ?? result.error.code ?? "";
        setSignInError(
          `${provider.name}: sign-in failed (${msg}). Verify that all required environment variables are set correctly (client ID, secret, issuer URL).`,
        );
        setSigningInProvider(null);
      }
    } catch {
      setSignInError(
        `${provider.name}: sign-in failed. Verify that all required environment variables are set correctly (client ID, secret, issuer URL).`,
      );
      setSigningInProvider(null);
    }
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
              {(showError || signInError) && (
                <Alert className="mb-4 border-red-500/40 bg-red-950/80 text-white [&>svg]:text-red-400">
                  <TbAlertTriangle />
                  <AlertTitle>Sign-in failed</AlertTitle>
                  <AlertDescription className="text-white/80">
                    {signInError ??
                      `An error occurred during sign-in (${error}).`}
                  </AlertDescription>
                </Alert>
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
                      onClick={() => handleSignIn(provider)}
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
