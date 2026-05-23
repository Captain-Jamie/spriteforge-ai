"use client";

import { useState } from "react";
import { AssetCard } from "./AssetCard";
import type { AssetRecord } from "@/lib/asset-schema";

type AssetGalleryProps = {
  assets?: AssetRecord[];
  onClearAssets: () => void;
  onRemoveAsset: (assetId: string) => void;
  onToggleSelectAsset: (assetId: string) => void;
  selectedAssetIds: string[];
};

export function AssetGallery({
  assets = [],
  onClearAssets,
  onRemoveAsset,
  onToggleSelectAsset,
  selectedAssetIds
}: AssetGalleryProps) {
  const [viewMode, setViewMode] = useState<"all" | "selected">("all");
  const visibleAssets =
    viewMode === "selected"
      ? assets.filter((asset) => selectedAssetIds.includes(asset.id))
      : assets;

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-200/70">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-zinc-950">素材库</h2>
          <p className="mt-1 text-sm text-zinc-600">
            {assets.length} 个素材，已选择 {selectedAssetIds.length} 个
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className={buttonClass(viewMode === "all")}
            onClick={() => setViewMode("all")}
            type="button"
          >
            全部
          </button>
          <button
            className={buttonClass(viewMode === "selected")}
            onClick={() => setViewMode("selected")}
            type="button"
          >
            已选 ({selectedAssetIds.length})
          </button>
          <button
            className="h-9 rounded-md border border-red-200 px-3 text-sm text-red-700 hover:bg-red-50 disabled:border-zinc-200 disabled:text-zinc-400 disabled:hover:bg-white"
            disabled={assets.length === 0}
            onClick={onClearAssets}
            type="button"
          >
            清空
          </button>
        </div>
      </div>
      {visibleAssets.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          {visibleAssets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              isSelected={selectedAssetIds.includes(asset.id)}
              onRemove={() => onRemoveAsset(asset.id)}
              onToggleSelect={() => onToggleSelectAsset(asset.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm leading-6 text-zinc-600">
          {viewMode === "selected"
            ? "选择素材后，这里会显示待导出的素材。"
            : "生成素材后，这里会显示可管理和导出的素材卡片。"}
        </div>
      )}
    </section>
  );
}

function buttonClass(isActive: boolean) {
  return isActive
    ? "h-9 rounded-md border border-teal-700 bg-teal-700 px-3 text-sm font-medium text-white"
    : "h-9 rounded-md border border-zinc-300 px-3 text-sm text-zinc-700 hover:bg-zinc-50";
}
