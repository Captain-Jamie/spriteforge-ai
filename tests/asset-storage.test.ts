import { afterEach, describe, expect, it, vi } from "vitest";
import type { AssetRecord } from "../lib/asset-schema";
import { loadAssets, saveAssets } from "../lib/asset-storage";

const baseAsset: AssetRecord = {
  id: "asset_1",
  batchId: "batch_1",
  name: "fire_slime",
  assetType: "character",
  style: "pixel_art",
  gameGenre: "rpg",
  view: "front",
  size: "128x128",
  background: "transparent",
  prompt: "fire slime",
  negativePrompt: "text, watermark",
  imageUrl: "data:image/png;base64,cached-image",
  sourceImageUrl: "https://cdn.example.test/fire-slime.png",
  createdAt: "2026-05-25T00:00:00.000Z"
};

describe("asset storage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("stores source image URLs instead of cached data URLs", () => {
    const storage = createLocalStorageMock();
    vi.stubGlobal("window", { localStorage: storage });

    saveAssets([baseAsset]);

    const rawAssets = JSON.parse(storage.getItem("spriteforge.assets.v1") ?? "[]");
    expect(rawAssets[0].imageUrl).toBe("https://cdn.example.test/fire-slime.png");
    expect(rawAssets[0].sourceImageUrl).toBe("https://cdn.example.test/fire-slime.png");
    expect(loadAssets()[0].imageUrl).toBe("https://cdn.example.test/fire-slime.png");
  });
});

function createLocalStorageMock() {
  const store = new Map<string, string>();

  return {
    getItem: (key: string) => store.get(key) ?? null,
    removeItem: (key: string) => store.delete(key),
    setItem: (key: string, value: string) => {
      store.set(key, value);
    }
  };
}
