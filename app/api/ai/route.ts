import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ChatGPTAPI } from 'chatgpt';
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(
      JSON.stringify({ status: "fail", message: "You are not logged in" }),
      { status: 401 }
    );
  }

  // const pass = request.nextUrl.searchParams.get('pass');
  const occurrenceId = request.nextUrl.searchParams.get('occurrence');

  if (!process.env.AIRBROKE_OPENAI_API_KEY) {
    return new Response('Unauthorized', { status: 401, headers: { 'content-type': 'text/event-stream' } });
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
    apiKey: process.env.AIRBROKE_OPENAI_API_KEY,
    debug: false,
  });
  const errorType = notice.kind;
  const errorMessage = occurrence.message;

  const prompt =
    `I encountered an error of type "${errorType}" with the following message: "${errorMessage}". ` +
    `Could you please explain what this error means and suggest possible solutions?`;

  let dataReceived = false;

  const responsePromise = api.sendMessage(prompt, {
    timeoutMs: 2 * 60 * 1000,
    onProgress: async (partialResponse) => {
      const cleanText = partialResponse.text.replace(/\n/g, "\\n");
      const data = new TextEncoder().encode(`data: ${cleanText}\n\n`);
      await writer.write(data);

      // Update flag if any data received
      if (cleanText) {
        dataReceived = true;
      }

      // If delta is undefined and some data has been received, close the writer
      if (dataReceived && partialResponse.delta === undefined) {
        await writer.close();
      }
    },
  });

  responsePromise
    .catch(async (error) => {
      console.error('An error occurred while processing the response:', error);
      const errorMessage = `An error occurred: ${error.message}\n\n`;
      const data = new TextEncoder().encode(`data: ${errorMessage}`);
      await writer.write(data);
    })
    .finally(async () => {
      if (!writer.closed) {
        await writer.close();
      }
    });

  return new Response(readable, {
    headers: {
      'content-type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}
