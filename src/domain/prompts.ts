import type { SimilarityHit } from "./ports/chunkRepositoryPort.js";

export function buildContext(results: SimilarityHit[]): string {
  return results.map((result) => result.content).join("\n");
}

export function buildPrompt(query: string, context: string): string {
  return `Contexto (trechos recuperados do repositório indexado):
    ${context}

    Pergunta:
    ${query}

    Use os trechos acima como referência de padrões quando forem relevantes. Alinhe a solução ao ecossistema VTEX (instruções completas estão na mensagem de sistema). Inclua diagramas em PlantUML somente quando clarificarem arquitetura ou fluxos.`;
}
