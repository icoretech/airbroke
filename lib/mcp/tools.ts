import { noticeTools } from "@/lib/mcp/tools/notices";
import { occurrenceTools } from "@/lib/mcp/tools/occurrences";
import { projectTools } from "@/lib/mcp/tools/projects";
import { searchTools } from "@/lib/mcp/tools/search";
import { setupGuideTools } from "@/lib/mcp/tools/setupGuide";
import type { ToolRegistry } from "@/lib/mcp/tools/toolSpec";

export { buildToolError, buildToolSuccess } from "@/lib/mcp/toolResult";
export type { McpToolResult } from "@/lib/mcp/toolResult";

export const MCP_TOOLS: ToolRegistry = {
  ...projectTools,
  ...noticeTools,
  ...occurrenceTools,
  ...searchTools,
  ...setupGuideTools,
};
