import { NextResponse } from "next/server";
import type { AssetRecord } from "@/lib/asset-schema";
import { GenerateAssetRequestSchema } from "@/lib/asset-schema";
import { generateImages } from "@/lib/image-service";
import { buildPrompt } from "@/lib/prompt-builder";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = GenerateAssetRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid asset generation request",
          issues: parsed.error.flatten()
        },
        { status: 400 }
      );
    }

    const assetRequest = parsed.data;
    const prompt = buildPrompt(assetRequest);
    const { images, mode } = await generateImages({ request: assetRequest, prompt });
    const createdAt = new Date().toISOString();
    const batchId = `batch_${Date.now().toString(36)}`;
    const batchCode = batchId.replace("batch_", "").slice(-6);

    const assets: AssetRecord[] = images.map((image, index) => ({
      id: `asset_${Date.now()}_${index + 1}`,
      batchId,
      name: buildAssetName(assetRequest.description, index, batchCode),
      assetType: assetRequest.assetType,
      style: assetRequest.style,
      gameGenre: assetRequest.gameGenre,
      view: assetRequest.view,
      size: assetRequest.size,
      background: assetRequest.background,
      prompt: prompt.positivePrompt,
      negativePrompt: prompt.negativePrompt,
      imageUrl: image.url,
      createdAt
    }));

    return NextResponse.json({ assets, prompt, mode });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected generation error";

    return NextResponse.json(
      {
        error: message
      },
      { status: getGenerationErrorStatus(message) }
    );
  }
}

function getGenerationErrorStatus(message: string) {
  if (
    message.includes("DASHSCOPE_API_KEY") ||
    message.includes("IMAGE_MODEL") ||
    message.includes("ALIYUN_VIAPI_CREDENTIALS")
  ) {
    return 503;
  }

  if (message.includes("timed out")) {
    return 504;
  }

  if (message.includes("DashScope")) {
    return 502;
  }

  if (message.includes("Aliyun image segmentation")) {
    return 502;
  }

  return 500;
}

function buildAssetName(description: string, index: number, batchCode: string) {
  const slug = description
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40);

  return `${slug || "asset"}_${index + 1}_${batchCode}`;
}
