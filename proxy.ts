// proxy.ts

export { auth as proxy } from "@/lib/auth";

export const config = {
  matcher: [
    "/((?!api|_next/|notifier_api|_vercel|icon|robots.txt|sitemap.xml).+)",
  ],
};
