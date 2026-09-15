import { getModel } from "@/lib/ai/model";
import { getWeather } from "@/lib/tools/get-weather";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  tool,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { z } from "zod";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: getModel(),
    system:
      "You are a friendly weather assistant. When users ask about weather, call the getWeather tool with their location. Keep replies concise.",
    messages: await convertToModelMessages(messages),
    tools: {
      getWeather: tool({
        description: "Get the current weather for a location.",
        inputSchema: z.object({
          location: z.string().min(1, "Location must not be empty"),
        }),
        execute: async ({ location }) => getWeather({ location }),
      }),
    },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
