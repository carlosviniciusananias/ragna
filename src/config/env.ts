import "dotenv/config";

const defaults = {
  matchCount: 5,
  llmModel: "llama-3.3-70b-versatile",
  embeddingModel: "Xenova/bge-small-en",
  groqBaseUrl: "https://api.groq.com/openai/v1",
  llmSystemPrompt: `Você é um desenvolvedor especialista na plataforma VTEX, com ampla experiência em VTEX IO, APIs VTEX e arquitetura de e-commerce.

    Siga rigorosamente os princípios abaixo:

    - Sempre responda como um desenvolvedor sênior.
    - Gere código limpo, organizado e pronto para produção.
    - Entregue sempre o código completo, nunca apenas trechos isolados.
    - Siga boas práticas de desenvolvimento (clean code, separação de responsabilidades, tipagem quando aplicável).
    - Respeite a arquitetura da VTEX (VTEX IO, services, middlewares, clients, etc).
    - Utilize padrões oficiais da VTEX sempre que possível.
    - Evite soluções improvisadas ou “gambiarras”.

    Regras importantes:

    - Sempre explique brevemente a solução antes do código.
    - Sempre inclua estrutura de arquivos quando relevante.
    - Se houver múltiplas abordagens, escolha a mais aderente ao ecossistema VTEX.
    - Nunca invente APIs da VTEX — use apenas endpoints reais e documentados.
    - Caso não tenha certeza sobre algo, sinalize claramente a limitação.
    - Sempre leve em consideração que as comunicações com APIs internas/externas são implementadas em clients.
    - Sempre leve em consideração o contexto de middlewares para expor APIs REST e resolvers para expor APIs GraphQL.

    Contexto adicional:

    - O código será utilizado em ambiente real de produção.
    - Priorize performance, escalabilidade e manutenção.

    Formato da resposta:

    1. Explicação curta da solução
    2. Estrutura de arquivos (se necessário)
    3. Código completo
    4. Observações importantes (se houver)`,
} as const;

export interface AppEnv {
  chunkRepositoryBackend: string | undefined;
  groqApiKey: string | undefined;
  repoPath: string | undefined;
  groqBaseUrl: string;
  matchCount: number;
  llmModel: string;
  llmSystemPrompt: string;
  embeddingModelId: string;
  databaseUrl?: string;
  databasePassword?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

function envOr(key: string, fallback: string): string {
  const v = process.env[key]?.trim();
  return v || fallback;
}

function chunkRepositoryEnv():
  | Pick<AppEnv, "databaseUrl" | "databasePassword">
  | Pick<AppEnv, "supabaseUrl" | "supabaseAnonKey"> {
  if (process.env.CHUNK_REPOSITORY === "postgres") {
    return {
      databaseUrl: process.env.POSTGRES_URL,
      databasePassword: process.env.POSTGRES_PASSWORD,
    };
  }
  return {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  };
}

export function loadEnv(): AppEnv {
  return {
    chunkRepositoryBackend: process.env.CHUNK_REPOSITORY,
    ...chunkRepositoryEnv(),
    groqApiKey: process.env.GROQ_API_KEY,
    repoPath: process.env.REPO_PATH,
    groqBaseUrl: envOr("GROQ_BASE_URL", defaults.groqBaseUrl),
    matchCount: defaults.matchCount,
    llmModel: envOr("LLM_MODEL", defaults.llmModel),
    llmSystemPrompt: defaults.llmSystemPrompt,
    embeddingModelId: envOr("EMBEDDING_MODEL", defaults.embeddingModel),
  };
}
