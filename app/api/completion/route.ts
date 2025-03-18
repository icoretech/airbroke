// app/api/completion/route.ts

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { type OpenAIProviderSettings, createOpenAI } from '@ai-sdk/openai';
import { CoreMessage, streamText } from 'ai';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return new Response('You are not logged in', { status: 401 });
  }

  const body = await request.json();
  const { isDetailMode, occurrenceId } = body;

  if (!process.env.AIRBROKE_OPENAI_API_KEY) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (!occurrenceId) {
    return new Response('Missing occurrence', { status: 400 });
  }

  const occurrenceWithRelations = await prisma.occurrence.findFirst({
    where: { id: occurrenceId },
    include: { notice: { include: { project: true } } },
  });

  if (!occurrenceWithRelations) {
    return new Response('Occurrence not found', { status: 404 });
  }

  const { notice, ...occurrence } = occurrenceWithRelations;

  const errorType = notice.kind;
  const errorMessage = occurrence.message;

  let prompt = `I encountered an error of type "${errorType}" with the following message: "${errorMessage}". Explain what this error means and suggest possible solutions.`;

  if (isDetailMode) {
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

  const openAISettings: OpenAIProviderSettings = {
    apiKey: process.env.AIRBROKE_OPENAI_API_KEY ?? '',
    compatibility: 'strict',
    ...(process.env.AIRBROKE_OPENAI_ORGANIZATION ? { organization: process.env.AIRBROKE_OPENAI_ORGANIZATION } : {}),
  };

  const openaiProvider = createOpenAI(openAISettings);
  const model = openaiProvider.responses(process.env.AIRBROKE_OPENAI_ENGINE || 'gpt-4o');

  // Stream the AI's response using streamText
  const result = streamText({
    model,
    messages,
  });

  // Return the streamed response
  return result.toDataStreamResponse();
}
