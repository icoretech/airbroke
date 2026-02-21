import { timingSafeEqual } from "node:crypto";
import { createMcpHandler, withMcpAuth } from "mcp-handler";
import { NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors";
import { buildToolError, buildToolSuccess, MCP_TOOLS } from "@/lib/mcp/tools";
import type { NextRequest } from "next/server";
import type { McpToolResult } from "@/lib/mcp/tools";

type JsonRpcId = string | number | null;

type JsonRpcErrorBody = {
  jsonrpc: "2.0";
  id: JsonRpcId;
  error: {
    code: number;
    message: string;
    data?: unknown;
  };
};

const MCP_SERVER_INFO = {
  name: "airbroke",
  version: "0.2.0",
} as const;

function jsonResponse(
  req: NextRequest,
  body: JsonRpcErrorBody | Record<string, unknown>,
  status = 200,
) {
  return NextResponse.json(body, {
    status,
    headers: corsHeaders(req.headers),
  });
}

function jsonRpcError(
  req: NextRequest,
  id: JsonRpcId,
  code: number,
  message: string,
  status = 200,
  data?: unknown,
) {
  const body: JsonRpcErrorBody = {
    jsonrpc: "2.0",
    id,
    error: { code, message, ...(data !== undefined ? { data } : {}) },
  };
  return jsonResponse(req, body, status);
}

function withCors(req: NextRequest, response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders(req.headers))) {
    headers.set(key, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function extractToken(headers: Headers): string | null {
  const direct = headers.get("X-Airbroke-Mcp-Key");
  if (direct?.trim()) {
    return direct.trim();
  }
  return null;
}

function secureTokenEqual(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) {
    return false;
  }
  return timingSafeEqual(aBuffer, bBuffer);
}

function isMcpApiEnabled(): boolean {
  return Boolean(process.env.AIRBROKE_MCP_API_KEY?.trim());
}

function getConfiguredAllowedOrigins(): string[] {
  const raw = process.env.AIRBROKE_MCP_ALLOWED_ORIGINS;
  if (!raw) {
    return [];
  }
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function getRequestOrigin(req: NextRequest): string | null {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!host) {
    return null;
  }
  const proto =
    req.headers.get("x-forwarded-proto") ??
    req.nextUrl.protocol.replace(":", "");
  return `${proto}://${host}`;
}

function isAllowedOrigin(req: NextRequest, origin: string): boolean {
  const configured = getConfiguredAllowedOrigins();
  if (configured.length > 0) {
    return configured.includes(origin);
  }

  const requestOrigin = getRequestOrigin(req);
  if (!requestOrigin) {
    return false;
  }
  return origin === requestOrigin;
}

async function verifyMcpToken(
  req: Request,
  bearerToken?: string,
): Promise<{ token: string; clientId: string; scopes: string[] } | undefined> {
  const expectedToken = process.env.AIRBROKE_MCP_API_KEY?.trim();
  if (!expectedToken) {
    return undefined;
  }

  const directToken = extractToken(req.headers);
  const providedToken = bearerToken?.trim() || directToken;
  if (!providedToken || !secureTokenEqual(providedToken, expectedToken)) {
    return undefined;
  }

  return {
    token: "airbroke-mcp",
    clientId: "airbroke-mcp",
    scopes: [],
  };
}

function createMcpTransportHandler() {
  return createMcpHandler(
    (server) => {
      for (const [name, tool] of Object.entries(MCP_TOOLS)) {
        server.registerTool(
          name,
          {
            description: tool.description,
            inputSchema: tool.inputSchema,
            annotations: { readOnlyHint: true },
          },
          async (rawArgs) => {
            const parsed = tool.inputSchema.safeParse(rawArgs ?? {});
            if (!parsed.success) {
              return buildToolError(`Invalid arguments for ${name}`, {
                issues: parsed.error.issues,
              });
            }

            const result = await tool.run(parsed.data);
            if (
              result &&
              typeof result === "object" &&
              "content" in (result as Record<string, unknown>) &&
              Array.isArray((result as Record<string, unknown>).content)
            ) {
              return result as McpToolResult;
            }
            return buildToolSuccess(result);
          },
        );
      }
    },
    { serverInfo: MCP_SERVER_INFO },
    { basePath: "/api", disableSse: true },
  );
}

function createAuthenticatedMcpTransportHandler() {
  // MCP transport handlers keep request/session state internally.
  // Recreate per request to avoid cross-request contamination.
  return withMcpAuth(createMcpTransportHandler(), verifyMcpToken, {
    required: true,
  });
}

function validateOrigin(req: NextRequest): Response | null {
  const origin = req.headers.get("origin");
  if (!origin) {
    return null;
  }

  if (isAllowedOrigin(req, origin)) {
    return null;
  }

  return jsonRpcError(req, null, -32001, "Forbidden origin", 403, { origin });
}

async function buildMcpHandlerRequest(req: NextRequest): Promise<Request> {
  const headers = new Headers(req.headers);

  if (req.method !== "POST") {
    return new Request(req.url, {
      method: req.method,
      headers,
    });
  }

  const bodyText = await req.clone().text();
  if (bodyText.length > 0 && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  return new Request(req.url, {
    method: req.method,
    headers,
    body: bodyText.length > 0 ? bodyText : undefined,
  });
}

async function handleMcpTransportRequest(req: NextRequest) {
  if (!isMcpApiEnabled()) {
    return jsonResponse(
      req,
      { error: "MCP API is disabled. Set AIRBROKE_MCP_API_KEY." },
      503,
    );
  }

  const originError = validateOrigin(req);
  if (originError) {
    return originError;
  }

  try {
    const handlerRequest = await buildMcpHandlerRequest(req);
    const response =
      await createAuthenticatedMcpTransportHandler()(handlerRequest);
    return withCors(req, response);
  } catch {
    return jsonRpcError(req, null, -32603, "Internal server error", 500);
  }
}

export async function handleMcpPost(req: NextRequest) {
  return handleMcpTransportRequest(req);
}

export async function handleMcpGet(req: NextRequest) {
  return handleMcpTransportRequest(req);
}

export async function handleMcpDelete(req: NextRequest) {
  return handleMcpTransportRequest(req);
}

export async function handleMcpOptions(req: NextRequest) {
  return new NextResponse("", {
    status: 200,
    headers: corsHeaders(req.headers),
  });
}
