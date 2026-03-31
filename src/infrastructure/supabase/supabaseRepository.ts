import type { SupabaseClient } from "@supabase/supabase-js";
import type { ChunkRepository, ChunkToInsert } from "../../domain/ports/chunkRepositoryPort.js";

export function createSupabaseRepository(
  supabase: SupabaseClient,
): ChunkRepository {
  return {
    async insertChunk(chunk: ChunkToInsert): Promise<void> {
      const { error } = await supabase.from("documents").insert({
        content: chunk.content,
        embedding: chunk.embedding,
        path: chunk.path,
        chunk_index: chunk.chunkIndex,
      });
      if (error) {
        throw error;
      }
    },

    async similaritySearch(queryEmbedding: number[], matchCount: number) {
      const { data, error } = await supabase.rpc("match_documents", {
        query_embedding: queryEmbedding,
        match_count: matchCount,
      });
      if (error) {
        throw error;
      }
      return data ?? [];
    },
  };
}
