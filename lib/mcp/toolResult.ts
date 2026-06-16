export type McpToolResult = {
  content: Array<{ type: "text"; text: string }>;
  structuredContent?: Record<string, unknown>;
  isError?: boolean;
};

export function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function toJsonSafe(value: unknown): unknown {
  if (typeof value === "bigint") {
    return value.toString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map((item) => toJsonSafe(item));
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const output: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(record)) {
      output[key] = toJsonSafe(nested);
    }
    return output;
  }

  return value;
}

export function buildToolSuccess(payload: unknown): McpToolResult {
  const safePayload = toJsonSafe(payload);
  const structuredContent =
    asRecord(safePayload) ??
    ({ value: safePayload } as Record<string, unknown>);

  return {
    content: [{ type: "text", text: JSON.stringify(safePayload, null, 2) }],
    structuredContent,
  };
}

export function buildToolError(
  message: string,
  details?: unknown,
): McpToolResult {
  const safeDetails = details === undefined ? null : toJsonSafe(details);

  return {
    isError: true,
    content: [{ type: "text", text: message }],
    structuredContent: {
      ok: false,
      error: message,
      details: safeDetails,
    },
  };
}
