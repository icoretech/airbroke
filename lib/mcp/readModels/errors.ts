export class McpReadModelError extends Error {
  readonly details: unknown;

  constructor(message: string, details?: unknown) {
    super(message);
    this.name = "McpReadModelError";
    this.details = details;
  }
}
