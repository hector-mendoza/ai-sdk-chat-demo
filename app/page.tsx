"use client";

import { Composer } from "@/components/chat/Composer";
import { MessageList } from "@/components/chat/MessageList";
import { mapUIMessagesToViewItems, toApiMessages } from "@/lib/chat/types";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useMemo, useState } from "react";

export default function Page() {
  const [input, setInput] = useState("");

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ messages }) => ({
          body: { messages: toApiMessages(messages) },
        }),
      }),
    [],
  );

  const { messages, sendMessage, status, error } = useChat({ transport });

  const viewItems = useMemo(() => mapUIMessagesToViewItems(messages), [messages]);
  const isBusy = status === "submitted" || status === "streaming";

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">AI SDK Chat Demo</h1>
        <p className="mt-2 text-sm text-slate-600">
          Streaming chat powered by the Vercel AI SDK, with one server-side{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5">getWeather</code> tool.
        </p>
      </header>

      <section className="flex min-h-[60vh] flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
        <div className="flex flex-1 flex-col overflow-hidden p-4">
          <MessageList items={viewItems} />
        </div>

        {error && (
          <p className="px-4 pb-2 text-sm text-red-600">{error.message}</p>
        )}

        <Composer
          disabled={isBusy}
          input={input}
          onInputChange={setInput}
          onSubmit={() => {
            const text = input.trim();
            if (!text || isBusy) return;
            sendMessage({ text });
            setInput("");
          }}
        />
      </section>
    </main>
  );
}
