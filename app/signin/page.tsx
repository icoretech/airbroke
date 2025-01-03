// app/signin/page.tsx

import { getSerializedProviders } from '@/lib/auth';
import SignInPageClient from './SignInPageClient';

export default async function SignInPage() {
  const providers = await getSerializedProviders();

  return <SignInPageClient providers={providers} />;
}
