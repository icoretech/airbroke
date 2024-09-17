import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { createOpenAI } from '@ai-sdk/openai';
import { CoreMessage, streamText } from 'ai';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse('You are not logged in', { status: 401 });
  }

  const extraData = request.nextUrl.searchParams.get('sendExtraData');
  const occurrenceId = request.nextUrl.searchParams.get('occurrence');

  if (!process.env.AIRBROKE_OPENAI_API_KEY) {
    return new NextResponse('Unauthorized', { status: 401 });
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

  const errorType = notice.kind;
  const errorMessage = occurrence.message;

  let prompt = `I encountered an error of type "${errorType}" with the following message: "${errorMessage}". Explain what this error means and suggest possible solutions.`;

  if (extraData) {
    const backtraceString = JSON.stringify(occurrence.backtrace, null, 2);
    prompt += ` The backtrace of the error is as follows: ${backtraceString}`;
  }

  // Prepare the messages array for the AI model
  const messages: CoreMessage[] = [
    {
      role: 'user',
      content: prompt,
    },
  ];

  const openaiProvider = createOpenAI({
    apiKey: process.env.AIRBROKE_OPENAI_API_KEY,
    organization: process.env.AIRBROKE_OPENAI_ORGANIZATION,
  });
  const model = openaiProvider(process.env.AIRBROKE_OPENAI_ENGINE || 'o1-mini');

  // Stream the AI's response using streamText
  const result = await streamText({
    model,
    messages,
  });

  // Return the streamed response
  return result.toDataStreamResponse();
}
