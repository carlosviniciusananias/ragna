import { ingestDocuments } from "../application/ingest.js";
import { answerQuery } from "../application/rag.js";
import type { EmbeddingPort, LlmClient } from "../application/ports.js";
import { loadEnv, type AppEnv } from "../config/env.js";
import type { ChunkRepository } from "../domain/ports/chunkRepositoryPort.js";
import { createChunkRepository } from "../infrastructure/chunkRepositoryFactory.js";
import { createXenovaEmbeddingAdapter } from "../infrastructure/embeddings/xenovaEmbedding.js";
import * as localLoader from "../infrastructure/filesystem/localDocumentLoader.js";
import { createGroqLlmClient } from "../infrastructure/llm/groqClient.js";

export interface RagApp {
  env: AppEnv;
  chunkRepository: ChunkRepository;
  embedding: EmbeddingPort;
  llm: LlmClient;
  ingest(repoPath?: string): Promise<void>;
  ask(query: string): Promise<string>;
}

export function createRagApp(): RagApp {
  const env = loadEnv();
  const chunkRepository = createChunkRepository(env);

  const embedding = createXenovaEmbeddingAdapter({
    modelId: env.embeddingModelId,
  });

  const llm = createGroqLlmClient({
    apiKey: env.groqApiKey,
    baseURL: env.groqBaseUrl,
  });

  return {
    env,
    chunkRepository,
    embedding,
    llm,
    ingest(repoPath = env.repoPath ?? ".") {
      return ingestDocuments({
        repoPath,
        walkDir: localLoader.walkDir,
        readFiles: localLoader.readFiles,
        embedding,
        chunkRepository,
      });
    },
    ask(query: string) {
      return answerQuery({
        query,
        embedding,
        chunkRepository,
        llm,
        matchCount: env.matchCount,
        llmModel: env.llmModel,
        systemPrompt: env.llmSystemPrompt,
      });
    },
  };
}
