import {
  handleMcpDelete,
  handleMcpGet,
  handleMcpOptions,
  handleMcpPost,
} from "@/lib/mcp/server";

export const GET = handleMcpGet;
export const POST = handleMcpPost;
export const OPTIONS = handleMcpOptions;
export const DELETE = handleMcpDelete;
