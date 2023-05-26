export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    '/((?!api|_next/|notifier_api|icon|robots.txt|sitemap.xml).+)',
  ],
};
