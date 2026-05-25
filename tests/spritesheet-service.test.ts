import sharp from "sharp";
import { describe, expect, it } from "vitest";
import type { AssetRecord } from "../lib/asset-schema";
import { buildSpriteSheet } from "../lib/spritesheet-service";

const redAsset = createTestAsset("asset_1", "red_potion", "red");
const blueAsset = createTestAsset("asset_2", "blue_potion", "blue");
const greenAsset = createTestAsset("asset_3", "green_potion", "green");

describe("spritesheet service", () => {
  it("builds a transparent PNG sprite sheet with frame metadata", async () => {
    const result = await buildSpriteSheet({
      assets: [redAsset, blueAsset, greenAsset],
      columns: 2,
      frameWidth: 32,
      frameHeight: 32
    });
    const metadata = await sharp(result.imageBuffer).metadata();

    expect(metadata.format).toBe("png");
    expect(metadata.width).toBe(64);
    expect(metadata.height).toBe(64);
    expect(result.metadata).toMatchObject({
      assetCount: 3,
      columns: 2,
      rows: 2,
      width: 64,
      height: 64
    });
    expect(result.frames).toEqual([
      expect.objectContaining({ id: "asset_1", x: 0, y: 0, width: 32, height: 32 }),
      expect.objectContaining({ id: "asset_2", x: 32, y: 0, width: 32, height: 32 }),
      expect.objectContaining({ id: "asset_3", x: 0, y: 32, width: 32, height: 32 })
    ]);
  });
});

function createTestAsset(id: string, name: string, fill: string): AssetRecord {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="${fill}"/></svg>`;

  return {
    id,
    name,
    assetType: "icon",
    style: "pixel_art",
    gameGenre: "rpg",
    view: "front",
    size: "32x32" as AssetRecord["size"],
    background: "transparent",
    prompt: `${fill} potion`,
    negativePrompt: "text, watermark",
    imageUrl: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
    createdAt: "2026-05-25T00:00:00.000Z"
  };
}
