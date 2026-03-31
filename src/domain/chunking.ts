export interface SourceDocument {
  path: string;
  content: string;
  fileName: string;
  extension: string;
}

export interface ChunkRecord {
  preview: string;
  content: string;
  chunkIndex: number;
  path: string;
}

export function getChunkPreview(text: string): string {
  return text.slice(0, 60);
}

export function chunkText(text: string): string[] {
  return text
    .split("\n\n")
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0);
}

export function chunkDocuments(documents: SourceDocument[]): ChunkRecord[] {
  return documents.flatMap((doc) => {
    const chunks = chunkText(doc.content);
    return chunks.map((chunk, index) => ({
      preview: getChunkPreview(chunk),
      content: chunk,
      chunkIndex: index,
      path: doc.path,
    }));
  });
}
