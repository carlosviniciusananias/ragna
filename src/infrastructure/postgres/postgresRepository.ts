import pg from "pg";
import type { ChunkRepository, ChunkToInsert } from "../../domain/ports/chunkRepositoryPort.js";

const { Client } = pg;

function toVectorParam(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}

export function createPostgresRepository({
  connectionString,
  password,
}: {
  connectionString: string;
  password: string | undefined;
}): ChunkRepository {
  const client = new Client(
    password != null && String(password).length > 0
      ? { connectionString, password }
      : { connectionString },
  );
  let connected = false;

  async function ensureConnected(): Promise<void> {
    if (!connected) {
      await client.connect();
      const { rows } = await client.query(
        "select current_database() as db, current_user as role",
      );
      const row = rows[0] as { db: string; role: string };
      console.log(`[postgres] connected database=${row.db} role=${row.role}`);
      connected = true;
    }
  }

  return {
    async insertChunk(chunk: ChunkToInsert): Promise<void> {
      await ensureConnected();
      await client.query(
        `
        insert into documents (content, embedding, path, chunk_index)
        values ($1, $2::vector, $3, $4)
        returning path, chunk_index
        `,
        [
          chunk.content,
          toVectorParam(chunk.embedding),
          chunk.path,
          chunk.chunkIndex,
        ],
      );
    },

    async similaritySearch(queryEmbedding: number[], matchCount: number) {
      await ensureConnected();
      const { rows } = await client.query<{ content: string }>(
        `
        select content
        from documents
        order by embedding <-> $1::vector
        limit $2
        `,
        [toVectorParam(queryEmbedding), matchCount],
      );
      return rows;
    },

    async close(): Promise<void> {
      if (!connected) {
        return;
      }
      await client.end();
      connected = false;
    },
  };
}
