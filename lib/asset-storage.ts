import { z } from "zod";
import { AssetRecordSchema, StyleProfileSchema, type AssetRecord, type StyleProfile } from "./asset-schema";

const ASSETS_STORAGE_KEY = "spriteforge.assets.v1";
const STYLE_PROFILE_STORAGE_KEY = "spriteforge.styleProfile.v1";
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

  window.localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(assets.map(toStoredAsset)));
}

export function clearStoredAssets() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ASSETS_STORAGE_KEY);
}

function toStoredAsset(asset: AssetRecord): AssetRecord {
  const sourceImageUrl = asset.sourceImageUrl ?? asset.imageUrl;

  return {
    ...asset,
    imageUrl: sourceImageUrl,
    sourceImageUrl
  };
}

export function loadStyleProfile(): StyleProfile {
  if (typeof window === "undefined") {
    return StyleProfileSchema.parse({});
  }

  const raw = window.localStorage.getItem(STYLE_PROFILE_STORAGE_KEY);

  if (!raw) {
    return StyleProfileSchema.parse({});
  }

  try {
    const parsed = JSON.parse(raw);
    const result = StyleProfileSchema.safeParse(parsed);

    return result.success ? result.data : StyleProfileSchema.parse({});
  } catch {
    return StyleProfileSchema.parse({});
  }
}

export function saveStyleProfile(styleProfile: StyleProfile) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STYLE_PROFILE_STORAGE_KEY, JSON.stringify(styleProfile));
}

export function clearStoredStyleProfile() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STYLE_PROFILE_STORAGE_KEY);
}
