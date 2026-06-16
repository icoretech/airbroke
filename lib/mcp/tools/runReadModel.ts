import { McpReadModelError } from "@/lib/mcp/readModels/errors";
import { buildToolError } from "@/lib/mcp/toolResult";

export async function runReadModel(
  readModel: () => Promise<unknown>,
): Promise<unknown> {
  try {
    return await readModel();
  } catch (error) {
    if (error instanceof McpReadModelError) {
      return buildToolError(error.message, error.details);
    }

    throw error;
  }
}
