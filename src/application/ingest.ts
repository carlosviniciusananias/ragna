import { chunkDocuments } from "../domain/chunking.js";
import type { SourceDocument } from "../domain/chunking.js";
import type { ChunkRepository, EmbeddingPort } from "./ports.js";

export async function ingestDocuments({
  repoPath,
  walkDir,
  readFiles,
  embedding,
  chunkRepository,
}: {
  repoPath: string;
  walkDir: (dir: string) => string[];
  readFiles: (paths: string[]) => SourceDocument[];
  embedding: EmbeddingPort;
  chunkRepository: ChunkRepository;
}): Promise<void> {
  const files = walkDir(repoPath);
  const documents = readFiles(files);
  const chunks = chunkDocuments(documents);

  for (const chunk of chunks) {
    try {
      const embeddingVec = await embedding.embed(chunk.content);
      await chunkRepository.insertChunk({
        content: chunk.content,
        embedding: embeddingVec,
        path: chunk.path,
        chunkIndex: chunk.chunkIndex,
      });
      console.log("Save:", chunk.path);
    } catch (err) {
      console.error("Error saving:", err);
    }
  }
}
