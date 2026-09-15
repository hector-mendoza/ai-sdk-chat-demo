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

export type ChatMessageInput = Omit<ChatMessage, "id" | "createdAt">;

export type ChatViewItem =
  | { kind: "message"; message: ChatMessage }
  | { kind: "tool"; toolCall: ToolCall; messageId: string };

function textFromParts(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("");
}

type GetWeatherToolPart = {
  type: "tool-getWeather";
  toolCallId: string;
  input?: GetWeatherArgs;
  output?: GetWeatherResult;
  errorText?: string;
  state:
    | "input-streaming"
    | "input-available"
    | "output-available"
    | "output-error";
};

function getWeatherArgs(input: GetWeatherArgs | undefined): GetWeatherArgs {
  if (input?.location) {
    return { location: input.location };
  }

  return { location: "Unknown" };
}

function mapToolPart(part: GetWeatherToolPart): ToolCall {
  const args = getWeatherArgs(part.input);

  if (part.state === "output-available" && part.output) {
    return {
      id: part.toolCallId,
      name: "getWeather",
      args,
      state: "done",
      result: part.output,
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
          toolCall: mapToolPart(part as GetWeatherToolPart),
        });
      }
    }
  }

  return items;
}

export function toApiMessages(messages: UIMessage[]): ChatMessageInput[] {
  return messages.map((message) => ({
    role: message.role === "user" ? "user" : "assistant",
    content: textFromParts(message),
  }));
}
