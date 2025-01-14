// app/api/v3/notices/route.ts

import { prisma } from '@/lib/db';
import parseNotice, { NoticeData } from '@/lib/parseNotice';
import { processError } from '@/lib/processError';
import { customAlphabet, urlAlphabet } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';

interface ProjectKeyInfo {
  projectKey: string;
  requestType: 'params' | 'headers' | 'unauthenticated';
}

function extractProjectKeyFromRequest(request: NextRequest): ProjectKeyInfo {
  const clientKey = request.nextUrl.searchParams.get('key');
  const authorization = request.headers.get('Authorization');
  const airbrakeToken = request.headers.get('X-Airbrake-Token');

  if (clientKey) {
    return { projectKey: clientKey, requestType: 'params' };
  } else if (authorization) {
    const [, token] = authorization.split(' ');
    return { projectKey: token, requestType: 'headers' };
  } else if (airbrakeToken) {
    return { projectKey: airbrakeToken, requestType: 'headers' };
  }

  return { projectKey: '', requestType: 'unauthenticated' };
}

async function parseRequestBody(request: NextRequest) {
  let whitelisted;

  const contentType = request.headers.get('content-type') || '';

  if (contentType === 'text/plain' || contentType === '') {
    // older clients, airbrake-js, etc.
    const rawBody = await request.text();
    const parsedBody = JSON.parse(rawBody) as NoticeData;
    whitelisted = parseNotice(parsedBody);
  } else {
    const jsonBody = (await request.json()) as NoticeData;
    whitelisted = parseNotice(jsonBody);
  }

  return whitelisted;
}

function generateCorsHeaders() {
  const corsOrigins = process.env.AIRBROKE_CORS_ORIGINS?.split(',') || [];

  return {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'origin, accept, content-type, authorization',
    'Access-Control-Allow-Origin': corsOrigins.length > 0 ? corsOrigins.join(', ') : '*',
  };
}

function getServerHostname(request: NextRequest) {
  const host = request.headers.get('host');
  const protocols = (request.headers.get('x-forwarded-proto') || 'https').split(',');
  const protocol = protocols[0].trim();

  if (host) {
    return `${protocol}://${host}`;
  }

  return null;
}

// POST /api/v3/projects/1/notices
async function POST(request: NextRequest) {
  const { projectKey, requestType } = extractProjectKeyFromRequest(request);

  const project = await prisma.project.findFirst({ where: { api_key: projectKey } });
  if (!project || project.paused) {
    const json_response = { error: '**Airbroke: Project not found or paused' };
    if (requestType === 'params') {
      return NextResponse.json(json_response, {
        status: 404,
        headers: generateCorsHeaders(),
      });
    } else {
      const headers = {
        ...generateCorsHeaders(),
        'WWW-Authenticate': `Bearer realm="Airbroke"`,
      };
      return NextResponse.json(json_response, { status: 404, headers });
    }
  }

  const whitelisted = await parseRequestBody(request);

  const errors = whitelisted.errors;
  const context = whitelisted.context;
  const environment = whitelisted.environment;
  const session = whitelisted.session;
  const requestParams = whitelisted.params;

  for (const error of errors) {
    await processError(project, error, context, environment, session, requestParams);
  }

  const customNanoid = customAlphabet(urlAlphabet, 21);
  const responseJSON = {
    id: customNanoid(),
    url: `${getServerHostname(request)}/projects/${project.id}`,
  };

  return NextResponse.json(responseJSON, {
    status: 201,
    headers: generateCorsHeaders(),
  });
}

async function OPTIONS() {
  return new NextResponse('', { status: 200, headers: generateCorsHeaders() });
}

export { OPTIONS, POST };
