import { anthropic } from "@ai-sdk/anthropic";

export function getModel() {
  const modelId = process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5";
  return anthropic(modelId);
}
