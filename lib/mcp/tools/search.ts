import { searchReadModel } from "@/lib/mcp/readModels/search";
import { runReadModel } from "@/lib/mcp/tools/runReadModel";
import { SearchArgsSchema } from "@/lib/mcp/tools/schemas";
import type { SearchArgs } from "@/lib/mcp/tools/schemas";
import type { ToolRegistry } from "@/lib/mcp/tools/toolSpec";

export const searchTools = {
  airbroke_search: {
    description:
      "Search across occurrences/notices/projects with optional filters for organization, project, env, and resolved status.",
    inputSchema: SearchArgsSchema,
    run: (args: SearchArgs) => runReadModel(() => searchReadModel(args)),
  },
} satisfies ToolRegistry;
