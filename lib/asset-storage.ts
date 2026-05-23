import { z } from "zod";
import { AssetRecordSchema, type AssetRecord } from "./asset-schema";

const ASSETS_STORAGE_KEY = "spriteforge.assets.v1";
const AssetListSchema = z.array(AssetRecordSchema);

export function loadAssets() {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(ASSETS_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    const result = AssetListSchema.safeParse(parsed);

    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

export function saveAssets(assets: AssetRecord[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(assets));
}

export function clearStoredAssets() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ASSETS_STORAGE_KEY);
}
