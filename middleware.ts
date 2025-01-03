// middleware.ts

export { auth as middleware } from '@/lib/auth';

export const config = {
  matcher: ['/((?!api|_next/|notifier_api|_vercel|icon|robots.txt|sitemap.xml).+)'],
};
