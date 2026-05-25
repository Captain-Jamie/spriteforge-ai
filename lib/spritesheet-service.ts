import sharp from "sharp";
import type { AssetRecord, SpriteSheetRequest } from "./asset-schema";
import { buildAssetFileName } from "./file-utils";

export type SpriteSheetFrame = {
  id: string;
  name: string;
  sourceFileName: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type SpriteSheetResult = {
  imageBuffer: Buffer;
  frames: SpriteSheetFrame[];
  metadata: {
    frameWidth: number;
    frameHeight: number;
    columns: number;
    rows: number;
    width: number;
    height: number;
    assetCount: number;
  };
};

export async function buildSpriteSheet(request: SpriteSheetRequest): Promise<SpriteSheetResult> {
  const columns = Math.min(request.columns, request.assets.length);
  const rows = Math.ceil(request.assets.length / columns);
  const width = columns * request.frameWidth;
  const height = rows * request.frameHeight;
  const frames = request.assets.map((asset, index) =>
    buildFrame(asset, index, columns, request.frameWidth, request.frameHeight)
  );
  const composite = await Promise.all(
    request.assets.map(async (asset, index) => ({
      input: await prepareFrameImage(asset, request.frameWidth, request.frameHeight),
      left: frames[index].x,
      top: frames[index].y
    }))
  );

  const imageBuffer = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite(composite)
    .png()
    .toBuffer();

  return {
    imageBuffer,
    frames,
    metadata: {
      frameWidth: request.frameWidth,
      frameHeight: request.frameHeight,
      columns,
      rows,
      width,
      height,
      assetCount: request.assets.length
    }
  };
}

function buildFrame(
  asset: AssetRecord,
  index: number,
  columns: number,
  frameWidth: number,
  frameHeight: number
): SpriteSheetFrame {
  return {
    id: asset.id,
    name: asset.name,
    sourceFileName: buildAssetFileName(asset),
    x: (index % columns) * frameWidth,
    y: Math.floor(index / columns) * frameHeight,
    width: frameWidth,
    height: frameHeight
  };
}

async function prepareFrameImage(asset: AssetRecord, frameWidth: number, frameHeight: number) {
  return sharp(await assetImageUrlToBuffer(asset.imageUrl))
    .resize(frameWidth, frameHeight, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toBuffer();
}

async function assetImageUrlToBuffer(imageUrl: string) {
  if (imageUrl.startsWith("data:")) {
    return assetDataUrlToBuffer(imageUrl);
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return fetchRemoteImage(imageUrl);
  }

  throw new Error("Unsupported sprite sheet image URL format");
}

function assetDataUrlToBuffer(dataUrl: string) {
  const [header, payload] = dataUrl.split(",", 2);

  if (!payload) {
    throw new Error("Unsupported sprite sheet image URL format");
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
      `Failed to fetch sprite sheet image: ${error instanceof Error ? error.message : "network error"}`
    );
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch sprite sheet image (${response.status})`);
  }

  const arrayBuffer = await response.arrayBuffer();

  if (arrayBuffer.byteLength === 0) {
    throw new Error("Sprite sheet image response is empty");
  }

  return Buffer.from(arrayBuffer);
}
