import { runRagQuery } from "./cli/runRagQuery.js";
// import { runIngest } from "./cli/runIngest.js";

const queryParts = [
  "Componente em react vtex io, consumindo o contexto useProduct() para exibir o nome do produto.",
];

runRagQuery(queryParts).catch((err: unknown) => {
  console.error(err);
  process.exitCode = 1;
});

// run when you want to ingest documents
// runIngest(process.env.REPO_PATH ?? undefined).catch((err) => {
//   console.error(err);
//   process.exitCode = 1;
// });
