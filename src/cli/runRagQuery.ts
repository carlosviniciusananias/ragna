import { createRagApp } from "./index.js";

export async function runRagQuery(queryParts: string[]): Promise<void> {
  const app = createRagApp();

  try {
    const out = await app.ask(queryParts.join(" ").trim());
    console.log("your output is:", out);
  } finally {
    await app.chunkRepository.close?.();
  }
}
