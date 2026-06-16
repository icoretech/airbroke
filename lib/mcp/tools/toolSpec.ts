import type { z } from "zod";

export type ToolSpec = {
  description: string;
  inputSchema: z.ZodTypeAny;
  run(args: unknown): Promise<unknown>;
};

export type ToolRegistry = Record<string, ToolSpec>;
