import { mean_pooling, pipeline } from "@xenova/transformers";
import type { Tensor } from "@xenova/transformers";
import type { EmbeddingPort } from "../../application/ports.js";
import { MODEL_MAX_LENGTH } from "../../config/constants.js";

type FeatureExtractionInstance = {
  tokenizer: (
    text: string,
    opts: { padding: boolean; truncation: boolean; max_length: number },
  ) => { attention_mask: Tensor };
  model: (inputs: unknown) => Promise<{ last_hidden_state: Tensor }>;
};

export function createXenovaEmbeddingAdapter({
  modelId,
}: {
  modelId: string;
}): EmbeddingPort {
  let extractor: FeatureExtractionInstance | null = null;

  async function getExtractor(): Promise<FeatureExtractionInstance> {
    if (!extractor) {
      extractor = (await pipeline(
        "feature-extraction",
        modelId,
      )) as FeatureExtractionInstance;
    }
    return extractor;
  }

  return {
    async embed(text: string): Promise<number[]> {
      const ext = await getExtractor();
      const model_inputs = ext.tokenizer(text, {
        padding: true,
        truncation: true,
        max_length: MODEL_MAX_LENGTH,
      });
      const outputs = await ext.model(model_inputs);
      const lastHidden = outputs.last_hidden_state;
      let result = mean_pooling(lastHidden, model_inputs.attention_mask);
      result = result.normalize(2, -1);
      return Array.from(result.data);
    },
  };
}
