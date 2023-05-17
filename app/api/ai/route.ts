import { prisma } from '@/lib/db';
import { ChatGPTAPI } from 'chatgpt';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // const pass = request.nextUrl.searchParams.get('pass');
  const occurrenceId = request.nextUrl.searchParams.get('occurrence');

  if (!process.env.OPENAI_API_KEY) {
    return new Response('Unauthorized', { status: 401, headers: { 'Content-Type': 'text/event-stream' } });
  }

  if (!occurrenceId) {
    return new NextResponse('Missing occurrence', { status: 400 });
  }

  const occurrenceWithRelations = await prisma.occurrence.findFirst({
    where: { id: BigInt(occurrenceId) },
    include: { notice: { include: { project: true } } }
  });

  if (!occurrenceWithRelations) {
    return new NextResponse('Occurrence not found', { status: 404 });
  }

  const { notice, ...occurrence } = occurrenceWithRelations;
  const { project, ...noticeData } = notice;

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY,
    debug: false,
  });
  const errorType = notice.kind;
  const errorMessage = occurrence.message;

  const prompt =
    `I encountered an error of type "${errorType}" with the following message: "${errorMessage}". ` +
    `Could you please explain what this error means and suggest possible solutions?`;

  const responsePromise = api.sendMessage(prompt, {
    timeoutMs: 2 * 60 * 1000,
    onProgress: async (partialResponse) => {
      const data = new TextEncoder().encode(`data: ${partialResponse.text}\n\n`);
      await writer.write(data);
    },
  });

  responsePromise
    .catch(async (error) => {
      const errorMessage = `An error occurred: ${error.message}\n\n`;
      const data = new TextEncoder().encode(`data: ${errorMessage}`);
      await writer.write(data);
    })
    .finally(async () => {
      await writer.close();
    });


  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}
