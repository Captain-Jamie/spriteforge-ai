import JSZip from "jszip";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { AssetRecord } from "../lib/asset-schema";
import { buildExportMetadata, buildExportPrompts, buildExportZip } from "../lib/export-service";

const testAsset: AssetRecord = {
  id: "asset_1",
  name: "fire_slime_monster_1",
  assetType: "character",
  style: "pixel_art",
  gameGenre: "rpg",
  view: "front",
  size: "128x128",
  background: "transparent",
  prompt: "pixel art style, 2D game character asset, Fire slime monster",
  negativePrompt: "text, watermark, blurry",
  imageUrl:
    "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22128%22%20height%3D%22128%22%3E%3Crect%20width%3D%22128%22%20height%3D%22128%22%20fill%3D%22red%22%2F%3E%3C%2Fsvg%3E",
  createdAt: "2026-05-23T00:00:00.000Z"
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("export service", () => {
  it("builds metadata for exported assets", () => {
    const metadata = buildExportMetadata({ assets: [testAsset] });

    expect(metadata.app).toBe("SpriteForge AI");
    expect(metadata.assetCount).toBe(1);
    expect(metadata.assets[0]).toMatchObject({
      id: "asset_1",
      fileName: "character_fire_slime_monster_1_128x128.png",
      assetType: "character"
    });
  });

  it("builds prompt records for exported assets", () => {
    const prompts = buildExportPrompts([testAsset]);

    expect(prompts).toEqual([
      {
        id: "asset_1",
        name: "fire_slime_monster_1",
        positivePrompt: testAsset.prompt,
        negativePrompt: testAsset.negativePrompt
      }
    ]);
  });

  it("builds a zip with assets, metadata and prompts", async () => {
    const zipBuffer = await buildExportZip({ assets: [testAsset] });
    const zip = await JSZip.loadAsync(zipBuffer);

    expect(zip.file("metadata.json")).toBeTruthy();
    expect(zip.file("prompts.json")).toBeTruthy();
    expect(zip.file("assets/character_fire_slime_monster_1_128x128.png")).toBeTruthy();

    const metadata = JSON.parse(await zip.file("metadata.json")!.async("string"));
    const prompts = JSON.parse(await zip.file("prompts.json")!.async("string"));

    expect(metadata.assetCount).toBe(1);
    expect(prompts[0].positivePrompt).toContain("Fire slime monster");
  });

  it("fetches remote image URLs and stores image bytes in the zip", async () => {
    const remoteAsset: AssetRecord = {
      ...testAsset,
      id: "asset_remote",
      imageUrl: "https://cdn.example.test/fire-slime.png"
    };
    const imageBytes = new Uint8Array([137, 80, 78, 71]);
    const fetchMock = vi.fn(async () => new Response(imageBytes, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const zipBuffer = await buildExportZip({ assets: [remoteAsset] });
    const zip = await JSZip.loadAsync(zipBuffer);
    const imageFile = zip.file("assets/character_fire_slime_monster_1_128x128.png");

    expect(fetchMock).toHaveBeenCalledWith("https://cdn.example.test/fire-slime.png");
    expect(imageFile).toBeTruthy();
    expect(await imageFile!.async("uint8array")).toEqual(imageBytes);
  });

  it("fails clearly when a remote image cannot be downloaded", async () => {
    const remoteAsset: AssetRecord = {
      ...testAsset,
      id: "asset_failed_remote",
      imageUrl: "https://cdn.example.test/missing.png"
    };
    vi.stubGlobal("fetch", vi.fn(async () => new Response("missing", { status: 404 })));

    await expect(buildExportZip({ assets: [remoteAsset] })).rejects.toThrow(
      "Failed to fetch remote image (404)"
    );
  });
});
