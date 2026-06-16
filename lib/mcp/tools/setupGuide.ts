import { getSetupGuideReadModel } from "@/lib/mcp/readModels/setupGuide";
import { runReadModel } from "@/lib/mcp/tools/runReadModel";
import { GetSetupGuideArgsSchema } from "@/lib/mcp/tools/schemas";
import type { GetSetupGuideArgs } from "@/lib/mcp/tools/schemas";
import type { ToolRegistry } from "@/lib/mcp/tools/toolSpec";

export const setupGuideTools = {
  airbroke_get_setup_guide: {
    description:
      "Get integration setup code for connecting an application to Airbroke. " +
      "Airbroke is an error-only collector — it does NOT support performance monitoring, " +
      "session replay, logs, or metrics. The provided code snippets explicitly disable " +
      "non-error features in each SDK (APM, remote config, tracing, etc.) to prevent " +
      "the SDK from sending data that Airbroke will not process. " +
      "IMPORTANT: these snippets were built by inspecting each SDK's configuration surface " +
      "at a point in time. SDKs evolve and may add new telemetry features. When helping a " +
      "user integrate Airbroke, verify the snippet against the SDK version in use and disable " +
      "any newer non-error features not yet covered by the template. " +
      "Supports Airbrake-compatible SDKs (Ruby, Node.js, Python, Go, Java, PHP, .NET, " +
      "iOS Swift/ObjC, Android, JS Browser) and Sentry SDKs (Browser, Node.js). " +
      "Optionally pass a project_id to get ready-to-use code with real credentials; " +
      "without it, templates contain placeholders.",
    inputSchema: GetSetupGuideArgsSchema,
    run: (args: GetSetupGuideArgs) =>
      runReadModel(() => getSetupGuideReadModel(args)),
  },
} satisfies ToolRegistry;
