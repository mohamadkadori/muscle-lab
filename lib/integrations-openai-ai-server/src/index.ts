import OpenAI from "openai";
export { zodResponseFormat } from "openai/helpers/zod";

let client: OpenAI | undefined;

/** Missing AI configuration must not prevent normal workout routes starting. */
export function getOpenAI(): OpenAI {
  if (!process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || !process.env.AI_INTEGRATIONS_OPENAI_API_KEY) {
    throw new Error("The OpenAI AI integration is not configured.");
  }
  client ??= new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
    timeout: 60000,
    maxRetries: 0,
  });
  return client;
}
