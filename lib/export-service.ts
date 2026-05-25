import JSZip from "jszip";
import type { AssetRecord, ExportApiRequest, StyleProfile } from "./asset-schema";
import { buildAssetFileName } from "./file-utils";

export type ExportMetadata = {
  app: "SpriteForge AI";
  exportedAt: string;
  assetCount: number;
  styleProfile?: StyleProfile;
  assets: Array<{
    id: string;
    name: string;
    fileName: string;
    assetType: AssetRecord["assetType"];
    style: AssetRecord["style"];
    gameGenre: AssetRecord["gameGenre"];
    view: AssetRecord["view"];
    size: AssetRecord["size"];
    background: AssetRecord["background"];
    createdAt: string;
  }>;
};

export type ExportPrompts = Array<{
  id: string;
  name: string;
  positivePrompt: string;
  negativePrompt: string;
}>;

export function buildExportMetadata({
  assets,
  styleProfile
}: ExportApiRequest): ExportMetadata {
  return {
    app: "SpriteForge AI",
    exportedAt: new Date().toISOString(),
    assetCount: assets.length,
    styleProfile,
    assets: assets.map((asset) => ({
      id: asset.id,
      name: asset.name,
      fileName: buildAssetFileName(asset),
      assetType: asset.assetType,
      style: asset.style,
      gameGenre: asset.gameGenre,
      view: asset.view,
      size: asset.size,
      background: asset.background,
      createdAt: asset.createdAt
    }))
  };
}

export function buildExportPrompts(assets: AssetRecord[]): ExportPrompts {
  return assets.map((asset) => ({
    id: asset.id,
    name: asset.name,
    positivePrompt: asset.prompt,
    negativePrompt: asset.negativePrompt
  }));
}

export async function buildExportZip(request: ExportApiRequest) {
  const zip = new JSZip();
  const metadata = buildExportMetadata(request);
  const prompts = buildExportPrompts(request.assets);

  zip.file("metadata.json", JSON.stringify(metadata, null, 2));
  zip.file("prompts.json", JSON.stringify(prompts, null, 2));

  for (const asset of request.assets) {
    zip.file(`assets/${buildAssetFileName(asset)}`, await assetImageUrlToBuffer(asset.imageUrl));
  }

  return zip.generateAsync({ type: "nodebuffer" });
}

async function assetImageUrlToBuffer(imageUrl: string) {
  if (imageUrl.startsWith("data:")) {
    return assetDataUrlToBuffer(imageUrl);
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return fetchRemoteImage(imageUrl);
  }

  throw new Error("Unsupported asset image URL format");
}

function assetDataUrlToBuffer(dataUrl: string) {
  const [header, payload] = dataUrl.split(",", 2);

  if (!payload) {
    throw new Error("Unsupported asset image URL format");
  }

  if (header.includes(";base64")) {
    return Buffer.from(payload, "base64");
  }

  return Buffer.from(decodeURIComponent(payload), "utf8");
}

async function fetchRemoteImage(imageUrl: string) {
  let response: Response;

  try {
    response = await fetch(imageUrl);
  } catch (error) {
    throw new Error(
      `Failed to fetch remote image: ${error instanceof Error ? error.message : "network error"}`
    );
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch remote image (${response.status})`);
  }

  const arrayBuffer = await response.arrayBuffer();

  if (arrayBuffer.byteLength === 0) {
    throw new Error("Remote image response is empty");
  }

  return Buffer.from(arrayBuffer);
}
