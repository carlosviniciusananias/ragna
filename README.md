# Ragna

This project was created to understand how **retrieval-augmented generation** (RAG) works, and to explore the ideas behind chunks, embeddings, semantic search, and context.

## The project implements

- **Chunks** are the parts of the text that are used to build context. They split the source into smaller pieces so retrieval can surface relevant passages.
- **Embeddings** are vectors that represent text. They turn language into geometry so similarity search can compare the query to chunks.
- **Semantic search** is the process of finding text that is meaningfully close to the query—not just keyword overlap—using those vectors.
- **Context** is the retrieved information passed to the model so answers stay grounded in your data.

## A simple flow to understand this project

<img width="1391" height="509" alt="image" src="https://github.com/user-attachments/assets/7b7d6c84-3efc-4f69-ae2e-fb9443babf28" />

## A simple flow to understand the queries that occur in this project.

<img width="1183" height="111" alt="image" src="https://github.com/user-attachments/assets/3fc1ef34-0c83-49a9-bc69-494ce04c8a4e" />

## Database

This project works with **Supabase** and **PostgreSQL**.

- To run with **supabase**, create your credentials and update your environment (`.env`): `CHUNK_REPOSITORY=supabase`, `SUPABASE_URL=...`, `SUPABASE_ANON_KEY=...`.
- To run with **local postgres**, run `docker-compose up -d` and update your environment (`.env`): `CHUNK_REPOSITORY=postgres`, `POSTGRES_PASSWORD=...`, `POSTGRES_URL=...`.

## Data ingestion

This project expects you to **ingest** data from a repository on disk.

- Set `REPO_PATH=...` in `.env` to point at the project folder you want to index on your machine.
- In [`src/index.ts`](src/index.ts), **comment out** the `runRagQuery` import and call (and related `queryParts`), and **uncomment** the `runIngest` import and the `runIngest(...)` block so ingestion runs instead of a query. Swap back when you want to run RAG queries again.

## How to run?

- Use **Node.js >= 20**
- Install dependencies: `yarn install`
- Run the project: `yarn start`

*Why was this project developed in node/typescript? I don't know python*
