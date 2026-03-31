import type { ChunkRepository } from "../domain/ports/chunkRepositoryPort.js";

export interface EmbeddingPort {
  embed(text: string): Promise<number[]>;
}

export type ChatMessage =
  | { role: "system"; content: string }
  | { role: "user"; content: string }
  | { role: "assistant"; content: string };

export interface LlmClient {
  complete(params: { model: string; messages: ChatMessage[] }): Promise<string>;
}

export type { ChunkRepository };
