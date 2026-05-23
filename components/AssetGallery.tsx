"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";
import { AssetCard } from "./AssetCard";
import type { AssetRecord, AssetType } from "@/lib/asset-schema";
import { ASSET_TYPES, ASSET_TYPE_LABELS } from "@/lib/constants";

type AssetGalleryProps = {
  assets?: AssetRecord[];
  focusedAssetId?: string | null;
  onFocusAsset: (assetId: string) => void;
  onClearAssets: () => void;
  onRemoveAsset: (assetId: string) => void;
  onToggleSelectAsset: (assetId: string) => void;
  selectedAssetIds: string[];
};

export function AssetGallery({
  assets = [],
  focusedAssetId,
  onFocusAsset,
  onClearAssets,
  onRemoveAsset,
  onToggleSelectAsset,
  selectedAssetIds
}: AssetGalleryProps) {
  const [viewMode, setViewMode] = useState<"all" | "selected">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [assetTypeFilter, setAssetTypeFilter] = useState<AssetType | "all">("all");
  const scopedAssets =
    viewMode === "selected" ? assets.filter((asset) => selectedAssetIds.includes(asset.id)) : assets;
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const visibleAssets = scopedAssets.filter((asset) => {
    const matchesType = assetTypeFilter === "all" || asset.assetType === assetTypeFilter;
    const matchesSearch =
      !normalizedSearchTerm ||
      asset.name.toLowerCase().includes(normalizedSearchTerm) ||
      asset.prompt.toLowerCase().includes(normalizedSearchTerm) ||
      ASSET_TYPE_LABELS[asset.assetType].includes(searchTerm.trim());

    return matchesType && matchesSearch;
  });
  const hasActiveFilters = Boolean(normalizedSearchTerm) || assetTypeFilter !== "all";

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
      <div className="mb-4 space-y-3 rounded-md border border-zinc-200 bg-zinc-50 p-3">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
            搜索素材
          </span>
          <div className="flex h-10 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm">
            <Search size={16} className="text-zinc-400" aria-hidden="true" />
            <input
              className="min-w-0 flex-1 border-0 bg-transparent outline-none placeholder:text-zinc-400"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="输入素材名、Prompt 或类型"
              value={searchTerm}
            />
            {searchTerm ? (
              <button
                aria-label="清除搜索"
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100"
                onClick={() => setSearchTerm("")}
                type="button"
              >
                <X size={14} aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </label>
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">素材类型</div>
          <div className="flex flex-wrap gap-2">
            <button
              className={filterButtonClass(assetTypeFilter === "all")}
              onClick={() => setAssetTypeFilter("all")}
              type="button"
            >
              全部类型 {scopedAssets.length}
            </button>
            {ASSET_TYPES.map((assetType) => (
              <button
                className={filterButtonClass(assetTypeFilter === assetType)}
                key={assetType}
                onClick={() => setAssetTypeFilter(assetType)}
                type="button"
              >
                {ASSET_TYPE_LABELS[assetType]} {scopedAssets.filter((asset) => asset.assetType === assetType).length}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mb-3 text-xs font-medium text-zinc-500">
        当前显示 {visibleAssets.length} / {scopedAssets.length} 个素材
      </div>
      {visibleAssets.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          {visibleAssets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              isFocused={focusedAssetId === asset.id}
              isSelected={selectedAssetIds.includes(asset.id)}
              onFocus={() => onFocusAsset(asset.id)}
              onRemove={() => onRemoveAsset(asset.id)}
              onToggleSelect={() => onToggleSelectAsset(asset.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm leading-6 text-zinc-600">
          {emptyStateText({
            assetCount: assets.length,
            hasActiveFilters,
            scopedAssetCount: scopedAssets.length,
            viewMode
          })}
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

function filterButtonClass(isActive: boolean) {
  return isActive
    ? "h-8 rounded-md border border-zinc-900 bg-zinc-900 px-2.5 text-xs font-medium text-white"
    : "h-8 rounded-md border border-zinc-300 bg-white px-2.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50";
}

function emptyStateText({
  assetCount,
  hasActiveFilters,
  scopedAssetCount,
  viewMode
}: {
  assetCount: number;
  hasActiveFilters: boolean;
  scopedAssetCount: number;
  viewMode: "all" | "selected";
}) {
  if (assetCount === 0) {
    return "生成素材后，这里会显示可管理和导出的素材卡片。";
  }

  if (viewMode === "selected" && scopedAssetCount === 0) {
    return "选择素材后，这里会显示待导出的素材。";
  }

  if (hasActiveFilters) {
    return "没有符合当前搜索或类型筛选条件的素材。";
  }

  return "暂无可显示的素材。";
}
