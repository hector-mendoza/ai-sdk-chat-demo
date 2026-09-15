import type { ChatViewItem } from "@/lib/chat/types";
import { MessageBubble } from "./MessageBubble";
import { ToolCallCard } from "./ToolCallCard";

type MessageListProps = {
  items: ChatViewItem[];
};

export function MessageList({ items }: MessageListProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/60 p-8 text-center text-sm text-slate-500">
        Ask about the weather in any city to see streaming replies and a tool call.
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto rounded-xl border border-slate-200 bg-white/70 p-4">
      {items.map((item) => {
        if (item.kind === "message") {
          return <MessageBubble key={item.message.id} message={item.message} />;
        }

        return (
          <div key={`${item.messageId}-${item.toolCall.id}`} className="max-w-[85%]">
            <ToolCallCard toolCall={item.toolCall} />
          </div>
        );
      })}
    </div>
  );
}
