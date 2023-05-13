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

  if (clientKey) {
    return { projectKey: clientKey, requestType: 'params' };
  } else if (authorization) {
    const [_authType, token] = authorization.split(' ');
    return { projectKey: token, requestType: 'headers' };
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
    const jsonBody = await request.json() as NoticeData;
    whitelisted = parseNotice(jsonBody);
  }

  return whitelisted;
}

export async function POST(request: NextRequest) {
  const { projectKey, requestType } = extractProjectKeyFromRequest(request);

  const project = await prisma.project.findFirst({ where: { api_key: projectKey } });
  if (!project) {
    if (requestType === 'params') {
      const json_response = { error: '**Airbroke: Project not found' };
      return NextResponse.json(json_response, { status: 404 });
    } else {
      const json_response = { error: '**Airbroke: Project not found' };
      const headers = { 'WWW-Authenticate': `Bearer realm="Airbroke"` };
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
    await processError(prisma, project, error, context, environment, session, requestParams);
    // const type = error.type;
    // const message = error.message;
    // const backtrace = error.backtrace;

    // const env = context.environment || 'unknown';
    // const current_notice = await prisma.notices.upsert({
    //   where: {
    //     project_id_env_kind: {
    //       project_id: project.id,
    //       env: env,
    //       kind: type,
    //     },
    //   },
    //   create: {
    //     env: env,
    //     kind: type,
    //     project: {
    //       connect: {
    //         id: project.id,
    //       },
    //     },
    //   },
    //   update: {
    //   },
    //   select: {
    //     id: true,
    //   },
    // });

    // const existing_occurrence = await prisma.occurrences.findFirst({
    //   where: {
    //     notice_id: current_notice.id,
    //     message: message,
    //   },
    // });

    // if (existing_occurrence) {
    //   await prisma.occurrences.update({
    //     where: {
    //       id: existing_occurrence.id,
    //     },
    //     data: {
    //       seen_count: {
    //         increment: 1,
    //       },
    //     },
    //   });
    // } else {
    //   await prisma.occurrences.create({
    //     data: {
    //       message: message,
    //       backtrace: JSON.parse(JSON.stringify(backtrace)),
    //       context: JSON.parse(JSON.stringify(context)),
    //       environment: JSON.parse(JSON.stringify(environment)),
    //       session: JSON.parse(JSON.stringify(session)),
    //       params: JSON.parse(JSON.stringify(requestParams)),
    //       notice: {
    //         connect: {
    //           id: current_notice.id,
    //         },
    //       },
    //     },
    //   });
    // }
  }


  const customNanoid = customAlphabet(urlAlphabet, 21);
  const jobId = customNanoid();
  const responseJSON = { id: jobId, url: `https://example.com/projects/${project.id}/notices` };
  return NextResponse.json(responseJSON, { status: 201 });
}
