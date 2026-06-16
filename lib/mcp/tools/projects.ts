import {
  getProjectReadModel,
  listProjectsReadModel,
} from "@/lib/mcp/readModels/projects";
import { runReadModel } from "@/lib/mcp/tools/runReadModel";
import {
  GetProjectArgsSchema,
  ListProjectsArgsSchema,
} from "@/lib/mcp/tools/schemas";
import type { GetProjectArgs, ListProjectsArgs } from "@/lib/mcp/tools/schemas";
import type { ToolRegistry } from "@/lib/mcp/tools/toolSpec";

export const projectTools = {
  airbroke_list_projects: {
    description:
      "List projects in Airbroke with optional filtering. Use this as the discovery-first tool when you only know a partial project or organization name.",
    inputSchema: ListProjectsArgsSchema,
    run: (args: ListProjectsArgs) =>
      runReadModel(() => listProjectsReadModel(args)),
  },
  airbroke_get_project: {
    description: "Get details for a single project by id.",
    inputSchema: GetProjectArgsSchema,
    run: (args: GetProjectArgs) =>
      runReadModel(() => getProjectReadModel(args)),
  },
} satisfies ToolRegistry;
