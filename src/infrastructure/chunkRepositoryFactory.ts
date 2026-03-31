import type { AppEnv } from "../config/env.js";
import { createSupabaseClient } from "./supabase/client.js";
import { createPostgresRepository } from "./postgres/postgresRepository.js";
import { createSupabaseRepository } from "./supabase/supabaseRepository.js";
import type { ChunkRepository } from "../domain/ports/chunkRepositoryPort.js";

export function createChunkRepository(env: AppEnv): ChunkRepository {
  if (env.chunkRepositoryBackend === "postgres") {
    if (!env.databaseUrl) {
      throw new Error("Please check your environment variables.");
    }
    
    return createPostgresRepository({
      connectionString: env.databaseUrl,
      password: env.databasePassword,
    });
  }

  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error("Please check your environment variables.");
  }

  const supabase = createSupabaseClient({
    url: env.supabaseUrl,
    anonKey: env.supabaseAnonKey,
  });

  return createSupabaseRepository(supabase);
}
