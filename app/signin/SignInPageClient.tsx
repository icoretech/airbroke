// app/signin/SignInPageClient.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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
import { TbAlertTriangle, TbShieldLock } from "react-icons/tb";
import { VscAzure } from "react-icons/vsc";
import FooterCredits from "@/components/layout/FooterCredits";
import PageBackground from "@/components/layout/PageBackground";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/client";
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
  callbackUrl: string;
  showError: boolean;
}

export default function SignInPageClient({
  providers,
  callbackUrl,
  showError,
}: SignInPageClientProps) {
  const [signingInProvider, setSigningInProvider] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) setSigningInProvider(null);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  const [signInError, setSignInError] = useState<string | null>(null);

  const handleSignIn = async (provider: ProviderInfo) => {
    setSigningInProvider(provider.id);
    setSignInError(null);

    try {
      const result = await authClient.signIn.social({
        provider: provider.id,
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
                  className="h-10"
                  height={338}
                  width={463}
                  style={{ width: "auto" }}
                />
              </Link>
            </div>

            {/* Card */}
            <Card>
              <CardHeader className="text-center">
                <CardTitle>
                  <h1>Sign in to Airbroke</h1>
                </CardTitle>
                {providers.length > 0 && (
                  <CardDescription>Choose a provider below.</CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {(showError || signInError) && (
                  <Alert variant="destructive">
                    <TbAlertTriangle aria-hidden="true" />
                    <AlertTitle>Sign-in failed</AlertTitle>
                    <AlertDescription>
                      {signInError ?? "An error occurred during sign-in."}
                    </AlertDescription>
                  </Alert>
                )}

                {providers.length === 0 ? (
                  <Empty className="p-0">
                    <EmptyHeader>
                      <EmptyTitle>Sign-in is unavailable</EmptyTitle>
                      <EmptyDescription>
                        No sign-in providers are configured. Contact your
                        administrator to enable access.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <div className="flex flex-col gap-3">
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
                            <Spinner
                              data-icon="inline-start"
                              aria-label="Signing in"
                            />
                          ) : (
                            Icon && (
                              <Icon
                                data-icon="inline-start"
                                aria-hidden="true"
                              />
                            )
                          )}
                          <span>Sign in with {provider.name}</span>
                        </Button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Link after form */}
            <p className="mt-3 text-center text-xs text-muted-foreground">
              <Link href="/" className="text-primary hover:underline">
                Go to homepage
              </Link>
            </p>
            {/* Footer */}
            <p className="mt-4 text-center text-xs text-muted-foreground">
              <FooterCredits />
            </p>
          </div>
        </div>
      </PageBackground>
    </main>
  );
}
