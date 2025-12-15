// app/api/completion/route.ts

import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { OpenAIProviderSettings } from "@ai-sdk/openai";
import type { ModelMessage } from "ai";

export const maxDuration = 30;

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return new Response("You are not logged in", { status: 401 });
  }

  const body: unknown = await request.json();
  const bodyRecord =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : {};

  const isDetailMode = bodyRecord.isDetailMode === true;
  const occurrenceId =
    typeof bodyRecord.occurrenceId === "string"
      ? bodyRecord.occurrenceId
      : typeof bodyRecord.prompt === "string"
        ? bodyRecord.prompt
        : undefined;

  if (!process.env.AIRBROKE_OPENAI_API_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!occurrenceId) {
    return new Response("Missing occurrence", { status: 400 });
  }

  const occurrenceWithRelations = await db.occurrence.findFirst({
    where: { id: occurrenceId },
    include: { notice: { include: { project: true } } },
  });

  if (!occurrenceWithRelations) {
    return new Response("Occurrence not found", { status: 404 });
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
  const messages: ModelMessage[] = [
    {
      role: "user",
      content: prompt,
    },
  ];

  const openAISettings: OpenAIProviderSettings = {
    apiKey: process.env.AIRBROKE_OPENAI_API_KEY ?? "",
    ...(process.env.AIRBROKE_OPENAI_ORGANIZATION
      ? { organization: process.env.AIRBROKE_OPENAI_ORGANIZATION }
      : {}),
  };

  const openaiProvider = createOpenAI(openAISettings);
  const model = openaiProvider.responses(
    process.env.AIRBROKE_OPENAI_ENGINE || "gpt-4o",
  );

  // Stream the AI's response using streamText
  const result = streamText({
    model,
    messages,
  });

  // Return the streamed response
  return result.toTextStreamResponse();
}
