import type { UIMessage } from "ai";

export type Role = "user" | "assistant" | "tool";

export type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  createdAt: string;
};

export type GetWeatherArgs = { location: string };

export type GetWeatherResult = {
  location: string;
  tempC: number;
  summary: string;
};

export type ToolCall =
  | {
      id: string;
      name: "getWeather";
      args: GetWeatherArgs;
      state: "pending";
    }
  | {
      id: string;
      name: "getWeather";
      args: GetWeatherArgs;
      state: "done";
      result: GetWeatherResult;
    }
  | {
      id: string;
      name: "getWeather";
      args: GetWeatherArgs;
      state: "error";
      error: string;
    };

export type ChatRequestMessage = Omit<ChatMessage, "id" | "createdAt">;

export type ChatViewItem =
  | { kind: "message"; message: ChatMessage }
  | { kind: "tool"; toolCall: ToolCall; messageId: string };

function textFromParts(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("");
}

function mapToolPart(part: {
  toolCallId: string;
  state: string;
  input?: unknown;
  output?: unknown;
  errorText?: string;
}): ToolCall {
  const args = (part.input ?? { location: "" }) as GetWeatherArgs;

  if (part.state === "output-available") {
    return {
      id: part.toolCallId,
      name: "getWeather",
      args,
      state: "done",
      result: part.output as GetWeatherResult,
    };
  }

  if (part.state === "output-error") {
    return {
      id: part.toolCallId,
      name: "getWeather",
      args,
      state: "error",
      error: part.errorText ?? "Tool call failed",
    };
  }

  return {
    id: part.toolCallId,
    name: "getWeather",
    args,
    state: "pending",
  };
}

export function mapUIMessagesToViewItems(messages: UIMessage[]): ChatViewItem[] {
  const items: ChatViewItem[] = [];

  for (const message of messages) {
    if (message.role === "user") {
      items.push({
        kind: "message",
        message: {
          id: message.id,
          role: "user",
          content: textFromParts(message),
          createdAt: new Date().toISOString(),
        },
      });
      continue;
    }

    if (message.role === "assistant") {
      const text = textFromParts(message);
      if (text.trim().length > 0) {
        items.push({
          kind: "message",
          message: {
            id: message.id,
            role: "assistant",
            content: text,
            createdAt: new Date().toISOString(),
          },
        });
      }

      for (const part of message.parts) {
        if (part.type !== "tool-getWeather") continue;

        items.push({
          kind: "tool",
          messageId: message.id,
          toolCall: mapToolPart(part),
        });
      }
    }
  }

  return items;
}
