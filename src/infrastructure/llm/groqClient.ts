import OpenAI from "openai";
import type { LlmClient } from "../../application/ports.js";

export function createGroqLlmClient({
  apiKey,
  baseURL,
}: {
  apiKey: string | undefined;
  baseURL: string;
}): LlmClient {
  const client = new OpenAI({
    apiKey,
    baseURL,
  });

  return {
    async complete(params) {
      const model = params.model;
      if (!model) {
        throw new Error("Model is required");
      }
      const response = await client.chat.completions.create({
        model,
        messages: params.messages,
      });
      const content = response.choices[0]?.message?.content;
      if (content == null) {
        throw new Error("Empty response from LLM");
      }
      return content;
    },
  };
}
