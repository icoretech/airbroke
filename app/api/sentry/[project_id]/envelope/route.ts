// app/api/sentry/[project_id]/envelope/route.ts

import { brotliDecompressSync, gunzipSync, inflateSync } from "node:zlib";
import { NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors";
import { db } from "@/lib/db";
import { parseSentryEnvelope } from "@/lib/parseSentryEnvelope";
import { processError } from "@/lib/processError";
import type { NextRequest } from "next/server";

const MAX_COMPRESSED_BODY_BYTES = 1024 * 1024;
const MAX_DECOMPRESSED_BODY_BYTES = 5 * 1024 * 1024;

class PayloadTooLargeError extends Error {}

function getProjectKey(req: NextRequest): string | null {
  const keyFromQuery = req.nextUrl.searchParams.get("sentry_key");
  if (keyFromQuery) return keyFromQuery;

  const auth = req.headers.get("x-sentry-auth");
  if (!auth) return null;

  // x-sentry-auth: Sentry sentry_key=..., sentry_version=...
  const cleaned = auth.startsWith("Sentry ")
    ? auth.slice("Sentry ".length)
    : auth;
  const parts = cleaned.split(",").map((p) => p.trim());
  for (const part of parts) {
    const [k, v] = part.split("=").map((s) => s.trim());
    if (k === "sentry_key" && v) return v;
  }

  return null;
}

async function readCompressedBody(req: NextRequest): Promise<Buffer> {
  const contentLength = Number(req.headers.get("content-length"));
  if (
    Number.isFinite(contentLength) &&
    contentLength > MAX_COMPRESSED_BODY_BYTES
  ) {
    throw new PayloadTooLargeError("Compressed envelope payload is too large");
  }

  const reader = req.body?.getReader();
  if (!reader) {
    return Buffer.alloc(0);
  }

  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    if (!value) {
      continue;
    }

    total += value.byteLength;
    if (total > MAX_COMPRESSED_BODY_BYTES) {
      throw new PayloadTooLargeError(
        "Compressed envelope payload is too large",
      );
    }

    chunks.push(value);
  }

  return Buffer.concat(chunks);
}

async function readEnvelopeBody(req: NextRequest): Promise<Uint8Array> {
  const encoding = (req.headers.get("content-encoding") || "").toLowerCase();
  const buffer = await readCompressedBody(req);

  try {
    if (encoding === "gzip") {
      return gunzipSync(buffer, {
        maxOutputLength: MAX_DECOMPRESSED_BODY_BYTES,
      });
    }
    if (encoding === "deflate") {
      return inflateSync(buffer, {
        maxOutputLength: MAX_DECOMPRESSED_BODY_BYTES,
      });
    }
    if (encoding === "br") {
      return brotliDecompressSync(buffer, {
        maxOutputLength: MAX_DECOMPRESSED_BODY_BYTES,
      });
    }
  } catch (err) {
    if (
      err instanceof RangeError &&
      "code" in err &&
      err.code === "ERR_BUFFER_TOO_LARGE"
    ) {
      throw new PayloadTooLargeError(
        "Decompressed envelope payload is too large",
      );
    }
    console.warn("Failed to decompress Sentry envelope", err);
  }

  if (buffer.byteLength > MAX_DECOMPRESSED_BODY_BYTES) {
    throw new PayloadTooLargeError("Envelope payload is too large");
  }

  return buffer;
}

async function POST(
  req: NextRequest,
  { params }: RouteContext<"/api/sentry/[project_id]/envelope">,
) {
  const { project_id } = await params;
  const projectKey = getProjectKey(req);

  if (!projectKey) {
    return NextResponse.json(
      { error: "missing sentry_key" },
      { status: 400, headers: corsHeaders(req.headers) },
    );
  }

  const project = await db.project.findFirst({
    where: { id: project_id, api_key: projectKey, paused: false },
  });

  if (!project) {
    return NextResponse.json(
      { error: "project not found or paused" },
      { status: 404, headers: corsHeaders(req.headers) },
    );
  }

  let bodyText: Uint8Array;
  try {
    bodyText = await readEnvelopeBody(req);
  } catch (err) {
    if (err instanceof PayloadTooLargeError) {
      return NextResponse.json(
        { error: "envelope payload too large" },
        { status: 413, headers: corsHeaders(req.headers) },
      );
    }
    throw err;
  }

  const parsed = parseSentryEnvelope(bodyText);

  if (parsed.notices.length === 0) {
    return NextResponse.json(
      { error: "no event items in envelope" },
      { status: 400, headers: corsHeaders(req.headers) },
    );
  }

  for (const item of parsed.notices) {
    const notice = item.notice;
    for (const error of notice.errors) {
      await processError(
        project,
        error,
        notice.context,
        notice.environment,
        notice.session,
        notice.params,
      );
    }
  }

  const firstEventId = parsed.notices.find((n) => n.eventId)?.eventId;

  return NextResponse.json(
    { id: firstEventId ?? parsed.notices[0]?.eventId ?? null },
    { status: 201, headers: corsHeaders(req.headers) },
  );
}

async function OPTIONS(req: NextRequest) {
  return new NextResponse("", {
    status: 200,
    headers: corsHeaders(req.headers),
  });
}

export { OPTIONS, POST };
