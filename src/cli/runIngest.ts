import { createRagApp } from "./index.js";

export async function runIngest(repoPath?: string): Promise<void> {
  const app = createRagApp();

  try {
    await app.ingest(repoPath);
    console.log("your documents were ingested successfully");
  } finally {
    await app.chunkRepository.close?.();
  }
}
