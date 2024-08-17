import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// doesn't work with next-auth https://github.com/vercel/next.js/issues/50444#issuecomment-1602746782
// export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse('You are not logged in', { status: 401 });
  }

  // const pass = request.nextUrl.searchParams.get('pass');
  const extraData = request.nextUrl.searchParams.get('sendExtraData');
  const occurrenceId = request.nextUrl.searchParams.get('occurrence');

  if (!process.env.AIRBROKE_OPENAI_API_KEY) {
    return new Response('Unauthorized', { status: 401, headers: { 'content-type': 'text/event-stream' } });
  }

  if (!occurrenceId) {
    return new NextResponse('Missing occurrence', { status: 400 });
  }

  const occurrenceWithRelations = await prisma.occurrence.findFirst({
    where: { id: occurrenceId },
    include: { notice: { include: { project: true } } },
  });

  if (!occurrenceWithRelations) {
    return new NextResponse('Occurrence not found', { status: 404 });
  }

  const { notice, ...occurrence } = occurrenceWithRelations;

  const openai = new OpenAI({
    apiKey: process.env.AIRBROKE_OPENAI_API_KEY,
    organization: process.env.AIRBROKE_OPENAI_ORGANIZATION || null,
  });

  const errorType = notice.kind;
  const errorMessage = occurrence.message;

  let prompt =
    `I encountered an error of type "${errorType}" with the following message: "${errorMessage}". ` +
    `Explain what this error means and suggest possible solutions.`;

  if (extraData) {
    const backtraceString = JSON.stringify(occurrence.backtrace, null, 2);
    prompt += ` The backtrace of the error is as follows: ${backtraceString}`;
  }

  // Truncate the prompt to fit within the OpenAI token limit
  const maxTokens = 4096;
  const promptTruncated = prompt.slice(0, maxTokens);

  // createCompletion at the moment results in a 404.
  const response = await openai.chat.completions.create({
    model: process.env.AIRBROKE_OPENAI_ENGINE || 'gpt-4o-latest',
    stream: true,
    temperature: 0.6,
    messages: [
      {
        role: 'system',
        content: promptTruncated,
      },
    ],
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
