import { buildContext, buildPrompt } from "../domain/prompts.js";
import type { ChunkRepository, EmbeddingPort, LlmClient } from "./ports.js";

export async function answerQuery({
  query,
  embedding,
  chunkRepository,
  llm,
  matchCount,
  llmModel,
  systemPrompt,
}: {
  query: string;
  embedding: EmbeddingPort;
  chunkRepository: ChunkRepository;
  llm: LlmClient;
  matchCount: number;
  llmModel: string;
  systemPrompt: string;
}): Promise<string> {
  const queryEmbedding = await embedding.embed(query);
  const results = await chunkRepository.similaritySearch(
    queryEmbedding,
    matchCount,
  );
  const context = buildContext(results);
  const userContent = buildPrompt(query, context);

  return llm.complete({
    model: llmModel,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
  });
}
