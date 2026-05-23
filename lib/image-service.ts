import type { GenerateAssetRequest, GeneratedImage, PromptBuildResult } from "./asset-schema";
import { createMockImages } from "./mock-assets";

export type ImageGenerationMode = "mock" | "real";

type GenerateImagesInput = {
  request: GenerateAssetRequest;
  prompt: PromptBuildResult;
};

export async function generateImages({
  request
}: GenerateImagesInput): Promise<{ images: GeneratedImage[]; mode: ImageGenerationMode }> {
  if (isMockMode()) {
    return {
      images: createMockImages(request.assetType, request.count),
      mode: "mock"
    };
  }

  throw new Error("Real image generation is not configured yet. Enable MOCK_IMAGE_GENERATION.");
}

function isMockMode() {
  return process.env.MOCK_IMAGE_GENERATION !== "false";
}
