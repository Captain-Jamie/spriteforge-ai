"use client";

import { useEffect, useMemo, useState } from "react";
import type { AssetRecord } from "@/lib/asset-schema";
import { clearStoredAssets, loadAssets, saveAssets } from "@/lib/asset-storage";

export function useAssets() {
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);

  useEffect(() => {
    const storedAssets = loadAssets();
    setAssets(storedAssets);
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    saveAssets(assets);
  }, [assets, hasHydrated]);

  const selectedAssets = useMemo(
    () => assets.filter((asset) => selectedAssetIds.includes(asset.id)),
    [assets, selectedAssetIds]
  );

  function addAssets(newAssets: AssetRecord[]) {
    setAssets((currentAssets) => [...newAssets, ...currentAssets]);
  }

  function removeAsset(assetId: string) {
    setAssets((currentAssets) => currentAssets.filter((asset) => asset.id !== assetId));
    setSelectedAssetIds((currentIds) => currentIds.filter((id) => id !== assetId));
  }

  function clearAssets() {
    setAssets([]);
    setSelectedAssetIds([]);
    clearStoredAssets();
  }

  function toggleSelectAsset(assetId: string) {
    setSelectedAssetIds((currentIds) =>
      currentIds.includes(assetId)
        ? currentIds.filter((id) => id !== assetId)
        : [...currentIds, assetId]
    );
  }

  return {
    addAssets,
    assets,
    clearAssets,
    hasHydrated,
    removeAsset,
    selectedAssetIds,
    selectedAssets,
    toggleSelectAsset
  };
}
