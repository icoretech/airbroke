// app/signin/SignInPageClient.tsx

'use client';

import FooterCredits from '@/components/FooterCredits';
import logo from '@/public/logo.svg';
import { signIn as nextAuthSignIn } from 'next-auth/react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FaApple, FaBitbucket, FaGithub, FaGitlab, FaGoogle, FaSlack } from 'react-icons/fa';
import { SiAmazoncognito, SiAuthentik, SiKeycloak, SiOkta } from 'react-icons/si';
import { SlDisc } from 'react-icons/sl';
import { VscAzure } from 'react-icons/vsc';

const providerIcons: Record<string, React.ElementType> = {
  github: FaGithub,
  atlassian: FaBitbucket,
  google: FaGoogle,
  gitlab: FaGitlab,
  keycloak: SiKeycloak,
  'microsoft-entra-id': VscAzure,
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
  const [signingInProvider, setSigningInProvider] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/projects';
  const error = searchParams.get('error');
  const showError = Boolean(error);

  const handleSignIn = (providerId: string) => {
    setSigningInProvider(providerId);
    nextAuthSignIn(providerId, { callbackUrl: callbackUrl });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-[#192231] to-gray-900 px-4">
      <div className="w-full max-w-md overflow-hidden rounded-lg bg-airbroke-800/90 p-6 shadow-lg sm:p-8">
        <div className="mb-6 flex flex-col items-center justify-center gap-y-2">
          <Image src={logo} alt="Airbroke Logo" className="h-12 w-auto" height="338" width="463" />
          <h1 className="mt-2 text-2xl font-bold text-white">Sign in to Airbroke</h1>
          <p className="text-sm text-gray-300">Choose your preferred sign-in method below.</p>
        </div>

        {showError && (
          <div className="mb-4 rounded border border-red-700 bg-red-800/90 p-2 text-red-100">
            Sign-in error: {error}.
          </div>
        )}

        {/* Provider Buttons */}
        <div className="space-y-3">
          {providers.map((provider) => {
            const Icon = providerIcons[provider.id];
            const isThisButtonSigningIn = signingInProvider === provider.id;

            return (
              <button
                key={provider.id}
                type="button"
                onClick={() => handleSignIn(provider.id)}
                disabled={Boolean(signingInProvider)}
                className="flex w-full items-center justify-center gap-x-2 rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-indigo-700 disabled:opacity-70"
              >
                {isThisButtonSigningIn ? (
                  <SlDisc className="h-6 w-6 animate-spin text-gray-300" />
                ) : (
                  <>
                    {Icon && <Icon className="h-5 w-5" />}
                    <span>Sign in with {provider.name}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
      {/* Footer */}
      <p className="mt-4 text-sm text-gray-400">
        <FooterCredits />
      </p>
    </div>
  );
}
