// Facts and links shared by the page, its metadata and the JSON-LD graph.
// Every claim on the site is sourced from the Airbroke repository; the source
// of each block is named next to it so it can be checked when the app changes.

export const SITE_URL = "https://airbroke.icorete.ch";
export const REPO_URL = "https://github.com/icoretech/airbroke";
export const SETUP_URL = `${REPO_URL}#deployment-options`;
export const CONFIG_URL = `${REPO_URL}#setup`;
export const MCP_URL = `${REPO_URL}#mcp-api-llmagent-integrations`;
export const AUTH_URL = `${REPO_URL}#authentication-layer`;
export const PRACTICES_URL = `${REPO_URL}#best-practices-for-efficient-error-collection-and-storage`;
export const LICENSE_URL = `${REPO_URL}/blob/main/LICENSE`;
export const RELEASES_URL = `${REPO_URL}/releases`;
export const CHANGELOG_URL = `${REPO_URL}/blob/main/CHANGELOG.md`;
export const ISSUES_URL = `${REPO_URL}/issues`;
export const IMAGE_URL = `${REPO_URL}/pkgs/container/airbroke`;
export const HELM_URL =
  "https://github.com/icoretech/helm/tree/main/charts/airbroke";
export const RAILWAY_URL = `${REPO_URL}/blob/main/deploy/railway/README.md`;
export const ICORETECH_URL = "https://icorete.ch/";
export const GITHUB_ORG_URL = "https://github.com/icoretech";
export const X_URL = "https://x.com/icoretech_inc";
export const X_HANDLE = "@icoretech_inc";

export const TITLE = "Airbroke: self-hosted, open-source error catcher";
export const SHARE_TITLE = "Airbroke: keep your SDKs, own your errors";
// Under 155 characters; leads with what Airbroke is.
export const DESCRIPTION =
  "Self-hosted, MIT-licensed error catcher on PostgreSQL. Keep your Airbrake or Sentry SDKs, replay failed requests, and let agents read errors over MCP.";

export const NAV = [
  { href: "#how", label: "How it works" },
  { href: "#ui", label: "The UI" },
  { href: "#replay", label: "Replay" },
  { href: "#agents", label: "Agents" },
  { href: "#self-host", label: "Self-host" },
  { href: "#faq", label: "FAQ" },
] as const;

// FAQ answers use [text](url) for links; the page renders them as anchors and
// the FAQPage structured data uses the plain text. Sources:
// README.md, lib/intake/upsertNoticeOccurrence.ts, lib/intake/parseSentryEnvelope.ts,
// lib/integrations/*, components/project/Overview.tsx, lib/auth/*, lib/mcp/*.
export const FAQ: { q: string; a: string }[] = [
  {
    q: "Is Airbroke a hosted service?",
    a: "No. Airbroke is software you deploy on your own server, cluster or platform account, and the errors it collects are stored in your own PostgreSQL database.",
  },
  {
    q: "Do I have to change my error reporting code?",
    a: "Usually only its configuration. An Airbrake notifier needs your Airbroke address as its host and the project key; a Sentry SDK needs a DSN and a tunnel pointing at Airbroke. Each project's page shows the snippet for its SDK with the address and key filled in.",
  },
  {
    q: "Which SDKs have setup snippets?",
    a: "Airbrake notifiers for Ruby and Rails, browser JavaScript, Node.js, Python, Swift, Objective-C, Android, .NET, Go, Java and PHP, and the Sentry SDKs for the browser and Node.js.",
  },
  {
    q: "Does it do tracing or performance monitoring?",
    a: "No. Airbroke collects errors only. The setup snippets switch off the SDKs' performance, tracing and remote configuration features, and the Sentry endpoint reads only the event items of an envelope.",
  },
  {
    q: "How does it keep the database small?",
    a: "Errors are grouped into notices by project, environment and error class, and each distinct message in a notice is one occurrence. A repeat raises that occurrence's counter and its hourly count instead of storing another copy, so the details you see come from its first report. Keep IDs out of messages and in params, or each one becomes its own occurrence: see [the best practices](https://github.com/icoretech/airbroke#best-practices-for-efficient-error-collection-and-storage).",
  },
  {
    q: "Is it ready for production?",
    a: "Airbroke is in active development, and the README leaves running it in production to your discretion. Every change ships as a versioned release with a [changelog](https://github.com/icoretech/airbroke/blob/main/CHANGELOG.md).",
  },
  {
    q: "What does it need to run?",
    a: "PostgreSQL 15 or later with 8 free connections per instance, about 300 MB of memory and one CPU core. Run the Docker image for amd64 or arm64, the Helm chart, Docker Compose, or one of the Vercel, Render, Railway, Netlify and Heroku templates.",
  },
  {
    q: "Who can sign in?",
    a: "People with an account on the OAuth providers you configure, among GitHub, GitLab, Bitbucket, Google, Apple, Microsoft Entra ID, Okta, Auth0, Keycloak, Authentik, Cognito, FusionAuth, BoxyHQ SAML, Atlassian, Salesforce and Slack. Sign-in can be limited to a GitHub organization, GitLab group, Bitbucket or Slack workspace, Microsoft tenant, Atlassian site, Salesforce organization or, for Google, Auth0, FusionAuth and BoxyHQ SAML, to email domains.",
  },
  {
    q: "Can AI agents read my errors?",
    a: "Yes, read-only. Set AIRBROKE_MCP_API_KEY and connect an MCP client to /api/mcp: it can find projects, list notices and occurrences, search across projects and fetch setup snippets, but it cannot change anything.",
  },
  {
    q: "What does it cost?",
    a: "Nothing. Airbroke is open source under the [MIT license](https://github.com/icoretech/airbroke/blob/main/LICENSE). You run it on your own infrastructure, and the optional Ask the AI panel uses your own OpenAI key.",
  },
];

const LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

export function plainAnswer(answer: string): string {
  return answer.replace(LINK, "$1");
}

export function answerParts(
  answer: string,
): ({ text: string } | { text: string; href: string })[] {
  const parts: ({ text: string } | { text: string; href: string })[] = [];
  let last = 0;
  for (const match of answer.matchAll(LINK)) {
    const index = match.index ?? 0;
    if (index > last) parts.push({ text: answer.slice(last, index) });
    parts.push({ text: match[1], href: match[2] });
    last = index + match[0].length;
  }
  if (last < answer.length) parts.push({ text: answer.slice(last) });
  return parts;
}
