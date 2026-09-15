import { tool } from "ai";
import { z } from "zod";
import type { GetWeatherArgs, GetWeatherResult } from "@/lib/chat/types";

const SUMMARIES = ["Sunny", "Cloudy", "Rainy", "Windy", "Partly cloudy"] as const;

function hashLocation(location: string): number {
  let hash = 0;
  for (const char of location.toLowerCase()) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash;
}

export async function getWeather(args: GetWeatherArgs): Promise<GetWeatherResult> {
  const location = args.location.trim();
  if (!location) {
    throw new Error("Location must be a non-empty string");
  }

  const hash = hashLocation(location);
  const tempC = 5 + (hash % 30);
  const summary = SUMMARIES[hash % SUMMARIES.length];

  return {
    location,
    tempC,
    summary,
  };
}

export const getWeatherTool = tool({
  description: "Get the current weather for a location in Celsius",
  inputSchema: z.object({
    location: z.string().min(1).describe("City or place name"),
  }),
  execute: getWeather,
});
