import type { ChatMessage } from "@/lib/chat/types";

type MessageBubbleProps = {
  message: ChatMessage;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-blue-600 text-white"
            : "border border-slate-200 bg-white text-slate-900"
        }`}
      >
        <p className="mb-1 text-xs font-medium uppercase tracking-wide opacity-70">
          {message.role}
        </p>
        <p className="whitespace-pre-wrap">{message.content || "…"}</p>
      </div>
    </div>
  );
}
