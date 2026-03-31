export interface ChunkToInsert {
  content: string;
  embedding: number[];
  path: string;
  chunkIndex: number;
}

export interface SimilarityHit {
  content: string;
}

export interface ChunkRepository {
  insertChunk(chunk: ChunkToInsert): Promise<void>;
  similaritySearch(
    queryEmbedding: number[],
    matchCount: number,
  ): Promise<SimilarityHit[]>;
  close?(): Promise<void>;
}
