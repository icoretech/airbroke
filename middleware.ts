export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    '/((?!api|_next/|notifier_api|_vercel|icon|robots.txt|sitemap.xml).+)',
  ],
};
