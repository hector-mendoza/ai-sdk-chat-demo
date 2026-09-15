import type { ToolCall } from "@/lib/chat/types";

type ToolCallCardProps = {
  toolCall: ToolCall;
};

export function ToolCallCard({ toolCall }: ToolCallCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-slate-900">getWeather</span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            toolCall.state === "done"
              ? "bg-emerald-100 text-emerald-800"
              : toolCall.state === "error"
                ? "bg-red-100 text-red-800"
                : "bg-amber-100 text-amber-800"
          }`}
        >
          {toolCall.state}
        </span>
      </div>

      <p className="text-sm text-slate-600">
        Location: <span className="font-medium text-slate-900">{toolCall.args.location}</span>
      </p>

      {toolCall.state === "done" && (
        <div className="mt-3 rounded-md bg-slate-50 p-3 text-sm">
          <p className="font-medium text-slate-900">{toolCall.result.summary}</p>
          <p className="mt-1 text-slate-600">{toolCall.result.tempC}°C in {toolCall.result.location}</p>
        </div>
      )}

      {toolCall.state === "error" && (
        <p className="mt-3 text-sm text-red-700">{toolCall.error}</p>
      )}

      {toolCall.state === "pending" && (
        <p className="mt-3 text-sm text-slate-500">Fetching weather…</p>
      )}
    </div>
  );
}
