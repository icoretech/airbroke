import {
  getNoticeReadModel,
  listNoticesReadModel,
} from "@/lib/mcp/readModels/notices";
import { runReadModel } from "@/lib/mcp/tools/runReadModel";
import {
  GetNoticeArgsSchema,
  ListNoticesArgsSchema,
} from "@/lib/mcp/tools/schemas";
import type { GetNoticeArgs, ListNoticesArgs } from "@/lib/mcp/tools/schemas";
import type { ToolRegistry } from "@/lib/mcp/tools/toolSpec";

export const noticeTools = {
  airbroke_list_notices: {
    description:
      "List notices for a project with optional search, env filter, sorting, and limit.",
    inputSchema: ListNoticesArgsSchema,
    run: (args: ListNoticesArgs) =>
      runReadModel(() => listNoticesReadModel(args)),
  },
  airbroke_get_notice: {
    description:
      "Get notice details with latest and top occurrences for faster debugging context.",
    inputSchema: GetNoticeArgsSchema,
    run: (args: GetNoticeArgs) => runReadModel(() => getNoticeReadModel(args)),
  },
} satisfies ToolRegistry;
