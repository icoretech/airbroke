import {
  getOccurrenceReadModel,
  listOccurrencesReadModel,
} from "@/lib/mcp/readModels/occurrences";
import { runReadModel } from "@/lib/mcp/tools/runReadModel";
import {
  GetOccurrenceArgsSchema,
  ListOccurrencesArgsSchema,
} from "@/lib/mcp/tools/schemas";
import type {
  GetOccurrenceArgs,
  ListOccurrencesArgs,
} from "@/lib/mcp/tools/schemas";
import type { ToolRegistry } from "@/lib/mcp/tools/toolSpec";

export const occurrenceTools = {
  airbroke_list_occurrences: {
    description:
      "List occurrences for a notice with optional search, sorting, and resolved filter.",
    inputSchema: ListOccurrencesArgsSchema,
    run: (args: ListOccurrencesArgs) =>
      runReadModel(() => listOccurrencesReadModel(args)),
  },
  airbroke_get_occurrence: {
    description:
      "Get full occurrence details, including parent notice and project.",
    inputSchema: GetOccurrenceArgsSchema,
    run: (args: GetOccurrenceArgs) =>
      runReadModel(() => getOccurrenceReadModel(args)),
  },
} satisfies ToolRegistry;
