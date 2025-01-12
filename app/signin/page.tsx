// app/signin/page.tsx

import { auth, getSerializedProviders } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SignInPageClient from './SignInPageClient';

export default async function SignInPage() {
  const session = await auth();
  if (session) {
    redirect('/projects');
  }

  const providers = await getSerializedProviders();

  return <SignInPageClient providers={providers} />;
}
