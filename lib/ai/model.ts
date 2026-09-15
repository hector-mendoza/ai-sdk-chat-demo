import { openai } from "@ai-sdk/openai";

export function getModel() {
  const modelId = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  return openai(modelId);
}
