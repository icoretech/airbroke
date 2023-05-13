import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/hc
// health check
export async function GET(request: NextRequest) {
  // just do something to check if the db is working
  // and do something with request or this will be compiled as static
  const source = request.nextUrl.searchParams.get('source');
  const project = await prisma.project.findFirst();

  // console.log(`${request.method} ${request.nextUrl.pathname} ${source}`);

  return new NextResponse(source || 'OK');
}
