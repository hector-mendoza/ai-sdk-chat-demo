# AI SDK Chat Demo

A learn-first demo for Hector: streaming chat with the [Vercel AI SDK](https://sdk.vercel.ai/) and one server-side tool.

## What this demos

- **Streaming chat** — `useChat` on the client receives a live UI message stream from `POST /api/chat`.
- **One server tool** — `getWeather` runs on the server via `streamText` + `tool()`, with results rendered in a `ToolCallCard`.
- **Clear boundaries** — AI SDK `UIMessage` parts are mapped to app types (`ChatMessage`, `ToolCall`) at the component layer; the wire protocol stays the AI SDK UI stream.

Out of scope by design: auth, multi-user, database, RAG, scout farm.

## Project layout

```
app/
  page.tsx                 # Chat shell (composer + message list + tool card)
  api/chat/route.ts        # POST → streamText with getWeather tool
lib/
  ai/model.ts              # Model wiring (Anthropic via env)
  tools/get-weather.ts     # Deterministic fake weather tool
  chat/types.ts            # ChatMessage, ToolCall, and UI mapping helpers
components/chat/
  Composer.tsx
  MessageList.tsx
  MessageBubble.tsx
  ToolCallCard.tsx
```

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy env template and add your key:

   ```bash
   cp .env.example .env.local
   ```

   Required:

   | Variable | Description |
   | --- | --- |
   | `ANTHROPIC_API_KEY` | Anthropic API key for `@ai-sdk/anthropic` |

   Optional:

   | Variable | Description |
   | --- | --- |
   | `ANTHROPIC_MODEL` | Model id (default: `claude-haiku-4-5`) |

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) and ask e.g. *"What's the weather in Paris?"*

## Build

```bash
npm run build
npm start
```

## Deploy

This repo is linked to Vercel. Pushing to `main` deploys automatically. Set `ANTHROPIC_API_KEY` (and optionally `ANTHROPIC_MODEL`) in the Vercel project environment variables.

## API

`POST /api/chat`

- **Request body:** `{ messages: Omit<ChatMessage, "id" | "createdAt">[] }` — each message has `role` and `content`. The client strips ids via `prepareSendMessagesRequest` before sending.
- **Response:** AI SDK UI message stream (consumed by `useChat`)

The app maps AI SDK stream parts to `ChatMessage` and `ToolCall` view models in `lib/chat/types.ts` at the component boundary.
