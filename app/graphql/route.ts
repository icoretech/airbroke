import schema from '@/lib/graphql/schema';
import { createYoga } from 'graphql-yoga';
import { NextRequest, NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'HEAD, GET, POST',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};

const yoga = createYoga({
  graphqlEndpoint: '/graphql',
  cors: {
    origin: '*',
    credentials: false,
    methods: ['HEAD', 'GET', 'POST'],
  },
  schema,
  graphiql: {
    headers: JSON.stringify({ Authorization: `Bearer ${process.env.AIRBROKE_GRAPHQL_AUTH_TOKEN}` }),
    title: 'Airbroke GraphQL Playground'
  },
});

function createResponse(status: number, message: string, headers = {}) {
  console.log(message);
  return new NextResponse(message, { status, headers: { ...corsHeaders, ...headers } });
}

function isAuthorized(request: NextRequest, token: string): boolean {
  const queryAuthToken = request.nextUrl.searchParams.get('auth-token');
  const headerAuthToken = request.headers.get('authorization')?.replace('Bearer ', '');
  return !!(token && (queryAuthToken === token || headerAuthToken === token));
}

async function handleRequest(request: NextRequest) {
  const yogaResponse = await yoga.handleRequest(request, {});
  const responseHeaders = Object.fromEntries(yogaResponse.headers.entries());
  return new NextResponse(yogaResponse?.body, {
    status: yogaResponse?.status || 403,
    headers: responseHeaders,
  });
}

export async function OPTIONS(request: NextRequest) {
  return handleRequest(request);
}

export async function GET(request: NextRequest) {
  const graphiqlEnabled = process.env.AIRBROKE_GRAPHIQL;
  if (!graphiqlEnabled) {
    return createResponse(403, 'GraphiQL is disabled. Access denied.');
  }
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  const graphqlEnabled = process.env.AIRBROKE_GRAPHQL;
  const authToken = process.env.AIRBROKE_GRAPHQL_AUTH_TOKEN || '';
  if (!graphqlEnabled) {
    return createResponse(403, 'GraphQL is disabled. Access denied.');
  }
  if (!isAuthorized(request, authToken)) {
    return createResponse(403, 'Unauthorized');
  }

  return handleRequest(request);
}
