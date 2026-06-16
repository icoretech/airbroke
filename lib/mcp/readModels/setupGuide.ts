import { db } from "@/lib/db";
import {
  airbrakeIntegrations,
  sentryIntegrations,
} from "@/lib/integrations/integrationsData";
import {
  projectNotFound,
  resolveProjectReferenceOrThrow,
} from "@/lib/mcp/readModels/projectResolution";
import type { GetSetupGuideArgs } from "@/lib/mcp/tools/schemas";

type SnippetOutput = {
  sdk: "airbrake" | "sentry";
  name: string;
  filename: string;
  language: string;
  code: string;
};

function resolveConfiguredBaseUrl(): { host: string; origin: string } {
  const baseUrl = process.env.BETTER_AUTH_URL;
  if (!baseUrl) {
    return {
      host: "your-airbroke-host.example.com",
      origin: "https://your-airbroke-host.example.com",
    };
  }

  try {
    const url = new URL(baseUrl);
    return { host: url.host, origin: url.origin };
  } catch {
    return {
      host: "your-airbroke-host.example.com",
      origin: "https://your-airbroke-host.example.com",
    };
  }
}

function applyTemplateReplacements(
  template: string,
  replacements: Record<string, string>,
): string {
  let result = template;
  for (const key in replacements) {
    const find = `{${key}}`;
    result = result.split(find).join(replacements[key]);
  }
  return result.trim();
}

function matchesFramework(
  integration: { name: string; language: string },
  frameworkFilter: string | undefined,
): boolean {
  return (
    !frameworkFilter ||
    integration.name.toLowerCase().includes(frameworkFilter) ||
    integration.language.toLowerCase().includes(frameworkFilter)
  );
}

function collectSnippets(
  args: GetSetupGuideArgs,
  replacements: Record<string, string>,
): SnippetOutput[] {
  const snippets: SnippetOutput[] = [];
  const includeAirbrake = !args.sdk || args.sdk === "airbrake";
  const includeSentry = !args.sdk || args.sdk === "sentry";
  const frameworkFilter = args.framework?.toLowerCase();

  if (includeAirbrake) {
    for (const item of airbrakeIntegrations) {
      if (!matchesFramework(item, frameworkFilter)) {
        continue;
      }
      snippets.push({
        sdk: "airbrake",
        name: item.name,
        filename: item.filename,
        language: item.language,
        code: applyTemplateReplacements(item.code, replacements),
      });
    }
  }

  if (includeSentry) {
    for (const item of sentryIntegrations) {
      if (!matchesFramework(item, frameworkFilter)) {
        continue;
      }
      snippets.push({
        sdk: "sentry",
        name: item.name,
        filename: item.filename,
        language: item.language,
        code: applyTemplateReplacements(item.code, replacements),
      });
    }
  }

  return snippets;
}

export async function getSetupGuideReadModel(args: GetSetupGuideArgs) {
  let { host, origin } = resolveConfiguredBaseUrl();
  let projectKey = "{YOUR_PROJECT_API_KEY}";
  let projectId = "{YOUR_PROJECT_ID}";
  let matchedBy: string | null = null;

  if (args.project_id) {
    const resolution = await resolveProjectReferenceOrThrow(args.project_id);
    matchedBy = resolution.matched_by;

    const project = await db.project.findUnique({
      where: { id: resolution.project.id },
      select: { id: true, api_key: true },
    });

    if (!project) {
      throw projectNotFound(resolution.project.id);
    }

    projectKey = project.api_key;
    projectId = project.id;
    ({ host, origin } = resolveConfiguredBaseUrl());
  }

  const replacements: Record<string, string> = {
    REPLACE_PROJECT_KEY: projectKey,
    REPLACE_AIRBROKE_HOST: host,
    REPLACE_AIRBROKE_URL: origin,
    REPLACE_PROJECT_ID: projectId,
  };

  return {
    project_id: projectId === "{YOUR_PROJECT_ID}" ? null : projectId,
    requested_project_id: args.project_id ?? null,
    matched_by: matchedBy,
    has_real_credentials: Boolean(args.project_id),
    snippets: collectSnippets(args, replacements),
    guidance:
      "Airbroke collects errors only. Each snippet disables non-error SDK " +
      "features (APM, tracing, remote config, session replay, etc.). " +
      "SDKs add new telemetry over time — verify the snippet against the " +
      "SDK version in use and disable any newer non-error features.",
  };
}
