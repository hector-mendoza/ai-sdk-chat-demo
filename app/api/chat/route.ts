import {
  convertToModelMessages,
  isStepCount,
  streamText,
  type UIMessage,
} from "ai";
import { getModel } from "@/lib/ai/model";
import type { ChatMessageInput } from "@/lib/chat/types";
import { getWeatherTool } from "@/lib/tools/get-weather";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: ChatMessageInput[] } = await req.json();

  const uiMessages: UIMessage[] = messages.map((message, index) => ({
    id: String(index),
    role: message.role === "user" ? "user" : "assistant",
    parts: [{ type: "text", text: message.content }],
  }));

  const result = streamText({
    model: getModel(),
    system:
      "You are a helpful assistant. When the user asks about weather, call the getWeather tool with their location, then summarize the result in a friendly reply.",
    messages: await convertToModelMessages(uiMessages),
    stopWhen: isStepCount(5),
    tools: {
      getWeather: getWeatherTool,
    },
  });

  return result.toUIMessageStreamResponse();
}
