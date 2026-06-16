// app/api/v3/notices/route.ts

import { customAlphabet, urlAlphabet } from "nanoid";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getProjectActivityTag } from "@/lib/cache/projectActivity";
import { corsHeaders } from "@/lib/cors";
import { db } from "@/lib/db";
import normalizeNoticeData from "@/lib/intake/normalizeNoticeData";
import { upsertNoticeOccurrence } from "@/lib/intake/upsertNoticeOccurrence";
import type { NextRequest } from "next/server";

interface ProjectKeyInfo {
  projectKey: string;
  requestType: "params" | "headers" | "unauthenticated";
}

class InvalidNoticePayloadError extends Error {
  constructor() {
    super("Invalid notice payload");
    this.name = "InvalidNoticePayloadError";
  }
}

function extractProjectKeyFromRequest(request: NextRequest): ProjectKeyInfo {
  const clientKey = request.nextUrl.searchParams.get("key");
  const authorization = request.headers.get("Authorization");
  const airbrakeToken = request.headers.get("X-Airbrake-Token");

  if (clientKey) {
    return { projectKey: clientKey, requestType: "params" };
  } else if (authorization) {
    const [, token] = authorization.split(" ");
    return { projectKey: token, requestType: "headers" };
  } else if (airbrakeToken) {
    return { projectKey: airbrakeToken, requestType: "headers" };
  }

  return { projectKey: "", requestType: "unauthenticated" };
}

async function parseRequestBody(request: NextRequest): Promise<unknown> {
  const contentType = (request.headers.get("content-type") || "").toLowerCase();

  try {
    if (contentType === "" || contentType.startsWith("text/plain")) {
      const rawBody = await request.text();
      return JSON.parse(rawBody) as unknown;
    }

    return await request.json();
  } catch {
    throw new InvalidNoticePayloadError();
  }
}

function invalidNoticePayloadResponse(request: NextRequest) {
  return NextResponse.json(
    { error: "Invalid notice payload" },
    {
      status: 400,
      headers: corsHeaders(request.headers),
    },
  );
}

function getServerHostname(request: NextRequest) {
  const host = request.headers.get("host");
  const protocols = (request.headers.get("x-forwarded-proto") || "https").split(
    ",",
  );
  const protocol = protocols[0].trim();

  if (host) {
    return `${protocol}://${host}`;
  }

  return null;
}

// POST /api/v3/projects/1/notices
async function POST(request: NextRequest) {
  const { projectKey, requestType } = extractProjectKeyFromRequest(request);

  const project = await db.project.findFirst({
    where: { api_key: projectKey },
  });
  if (!project || project.paused) {
    const json_response = { error: "**Airbroke: Project not found or paused" };
    if (requestType === "params") {
      return NextResponse.json(json_response, {
        status: 404,
        headers: corsHeaders(request.headers),
      });
    } else {
      const headers = {
        ...corsHeaders(request.headers),
        "WWW-Authenticate": `Bearer realm="Airbroke"`,
      };
      return NextResponse.json(json_response, { status: 404, headers });
    }
  }

  let rawNoticeData: unknown;
  try {
    rawNoticeData = await parseRequestBody(request);
  } catch (error) {
    if (error instanceof InvalidNoticePayloadError) {
      return invalidNoticePayloadResponse(request);
    }
    throw error;
  }

  const noticeData = normalizeNoticeData(rawNoticeData);
  const errors = noticeData.errors;
  const context = noticeData.context;
  const environment = noticeData.environment;
  const session = noticeData.session;
  const requestParams = noticeData.params;

  await Promise.all(
    errors.map((error) =>
      upsertNoticeOccurrence({
        project,
        error,
        context,
        environment,
        session,
        requestParams,
      }),
    ),
  );

  revalidateTag(getProjectActivityTag(project.id), "max");

  const customNanoid = customAlphabet(urlAlphabet, 21);
  const responseJSON = {
    id: customNanoid(),
    url: `${getServerHostname(request)}/projects/${project.id}`,
  };

  return NextResponse.json(responseJSON, {
    status: 201,
    headers: corsHeaders(request.headers),
  });
}

async function OPTIONS(request: NextRequest) {
  return new NextResponse("", {
    status: 200,
    headers: corsHeaders(request.headers),
  });
}

export { OPTIONS, POST };
