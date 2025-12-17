type HeadersLike = Pick<Headers, "get">;

const DEFAULT_ALLOW_HEADERS =
  "origin, accept, content-type, authorization, x-airbrake-token, x-sentry-auth, sentry-trace, baggage, content-encoding";

const VARY_HEADERS =
  "Origin, Access-Control-Request-Headers, Access-Control-Request-Method";

function parseAllowedOriginsEnv(): string[] {
  return (process.env.AIRBROKE_CORS_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function resolveAllowOrigin(
  allowedOrigins: string[],
  requestOrigin: string | null,
): string | null {
  if (allowedOrigins.length === 0) return "*";
  if (allowedOrigins.includes("*")) return "*";

  if (!requestOrigin) {
    // Non-browser requests often omit Origin; CORS doesn't apply, but returning a
    // deterministic value keeps responses stable for intermediaries.
    return allowedOrigins[0] ?? null;
  }

  return allowedOrigins.includes(requestOrigin) ? requestOrigin : null;
}

export function corsHeaders(headers: HeadersLike): Record<string, string> {
  const allowedOrigins = parseAllowedOriginsEnv();
  const requestOrigin = headers.get("origin");
  const allowOrigin = resolveAllowOrigin(allowedOrigins, requestOrigin);

  const requestedHeaders = headers.get("access-control-request-headers");
  const allowHeaders = requestedHeaders?.trim() || DEFAULT_ALLOW_HEADERS;

  const response: Record<string, string> = {
    Vary: VARY_HEADERS,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": allowHeaders,
  };

  if (allowOrigin) {
    response["Access-Control-Allow-Origin"] = allowOrigin;
  }

  return response;
}
