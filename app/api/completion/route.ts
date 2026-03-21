// app/api/completion/route.ts

import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { OpenAIProviderSettings } from "@ai-sdk/openai";
import type { ModelMessage } from "ai";

export const maxDuration = 30;
const MAX_ERROR_MESSAGE_LENGTH = 1_500;
const MAX_BACKTRACE_FRAMES = 15;
const MAX_BACKTRACE_LENGTH = 2_000;
export const MAX_PROMPT_LENGTH = 4_000;

function clampText(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 3)}...`;
}

function buildPrompt({
  errorType,
  errorMessage,
  backtrace,
  isDetailMode,
}: {
  errorType: string;
  errorMessage: string;
  backtrace: unknown;
  isDetailMode: boolean;
}): string {
  const boundedMessage = clampText(errorMessage, MAX_ERROR_MESSAGE_LENGTH);
  let prompt = `I encountered an error of type "${errorType}" with the following message: "${boundedMessage}". Explain what this error means and suggest possible solutions.`;

  if (isDetailMode) {
    const boundedBacktrace = Array.isArray(backtrace)
      ? backtrace.slice(0, MAX_BACKTRACE_FRAMES)
      : backtrace;
    const backtraceString = clampText(
      JSON.stringify(boundedBacktrace, null, 2),
      MAX_BACKTRACE_LENGTH,
    );
    prompt += ` The backtrace of the error is as follows: ${backtraceString}`;
  }

  return clampText(prompt, MAX_PROMPT_LENGTH);
}

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

  const prompt = buildPrompt({
    errorType: notice.kind,
    errorMessage: occurrence.message,
    backtrace: occurrence.backtrace,
    isDetailMode,
  });

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
