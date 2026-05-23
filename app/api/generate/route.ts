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

    const assets: AssetRecord[] = images.map((image, index) => ({
      id: `asset_${Date.now()}_${index + 1}`,
      name: buildAssetName(assetRequest.description, index),
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
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unexpected generation error"
      },
      { status: 500 }
    );
  }
}

function buildAssetName(description: string, index: number) {
  const slug = description
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40);

  return `${slug || "asset"}_${index + 1}`;
}
