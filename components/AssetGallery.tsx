"use client";

import {
  Archive,
  FileArchive,
  FileImage,
  FileJson,
  Filter,
  Grid2X2,
  Search,
  Trash2,
  X
} from "lucide-react";
import { useMemo, useState } from "react";
import { AssetCard } from "./AssetCard";
import type { AssetRecord, AssetType, StyleProfile } from "@/lib/asset-schema";
import { ASSET_TYPES, ASSET_TYPE_LABELS } from "@/lib/constants";

type AssetGalleryProps = {
  assets?: AssetRecord[];
  focusedAssetId?: string | null;
  onFocusAsset: (assetId: string) => void;
  onClearAssets: () => void;
  onRemoveAsset: (assetId: string) => void;
  onToggleSelectAsset: (assetId: string) => void;
  selectedAssets: AssetRecord[];
  selectedAssetIds: string[];
  styleProfile?: StyleProfile;
};

export function AssetGallery({
  assets = [],
  focusedAssetId,
  onFocusAsset,
  onClearAssets,
  onRemoveAsset,
  onToggleSelectAsset,
  selectedAssets,
  selectedAssetIds,
  styleProfile
}: AssetGalleryProps) {
  const [viewMode, setViewMode] = useState<"all" | "selected">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [assetTypeFilter, setAssetTypeFilter] = useState<AssetType | "all">("all");
  const [exportError, setExportError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const exportAssets = selectedAssets.length > 0 ? selectedAssets : assets;
  const exportMode = selectedAssets.length > 0 ? "selected" : "all";
  const exportLabel = useMemo(() => {
    if (assets.length === 0) {
      return "暂无可导出的素材";
    }

    return selectedAssets.length > 0
      ? `导出已选素材（${selectedAssets.length}）`
      : `导出全部素材（${assets.length}）`;
  }, [assets.length, selectedAssets.length]);
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

  async function handleExport() {
    if (exportAssets.length === 0) {
      return;
    }

    setExportError(null);
    setIsExporting(true);

    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ assets: exportAssets, styleProfile })
      });

      if (!response.ok) {
        const payload = await readJsonResponse(response);
        throw new Error(readErrorMessage(payload, "导出素材包失败"));
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "spriteforge-export.zip";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setIsExportDialogOpen(false);
    } catch (exportError) {
      setExportError(exportError instanceof Error ? exportError.message : "导出素材包失败");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-sm shadow-zinc-300/80">
      <div className="border-b border-zinc-200 bg-white px-3 py-2">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-zinc-950">素材库</h2>
            <span className="text-xs text-zinc-500">{assets.length} 个素材</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              aria-label="筛选素材"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50"
              type="button"
            >
              <Filter size={15} aria-hidden="true" />
            </button>
            <button
              aria-label="网格视图"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50"
              type="button"
            >
              <Grid2X2 size={15} aria-hidden="true" />
            </button>
            <button
              aria-label="清空素材库"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 bg-white text-red-600 hover:bg-red-50 disabled:border-zinc-200 disabled:text-zinc-300 disabled:hover:bg-white"
              disabled={assets.length === 0}
              onClick={() => setIsClearDialogOpen(true)}
              type="button"
            >
              <Trash2 size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={buttonClass(viewMode === "all")}
            onClick={() => setViewMode("all")}
            type="button"
          >
            全部 ({assets.length})
          </button>
          <button
            className={buttonClass(viewMode === "selected")}
            onClick={() => setViewMode("selected")}
            type="button"
          >
            已选 ({selectedAssetIds.length})
          </button>
          <div className="relative min-w-0 flex-1">
            <Search
              size={14}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400"
              aria-hidden="true"
            />
            <input
              aria-label="搜索素材"
              className="h-8 w-full rounded-md border border-zinc-300 bg-white pl-8 pr-8 text-xs outline-none placeholder:text-zinc-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="搜索素材名或 Prompt"
              value={searchTerm}
            />
            {searchTerm ? (
              <button
                aria-label="清除搜索"
                className="absolute right-1 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100"
                onClick={() => setSearchTerm("")}
                type="button"
              >
                <X size={13} aria-hidden="true" />
              </button>
            ) : null}
          </div>
          <button
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-teal-300 bg-teal-400 px-2.5 text-xs font-semibold text-zinc-950 hover:bg-teal-300 disabled:border-zinc-200 disabled:bg-zinc-100 disabled:text-zinc-400"
            disabled={exportAssets.length === 0}
            onClick={() => {
              setExportError(null);
              setIsExportDialogOpen(true);
            }}
            type="button"
          >
            <Archive size={15} aria-hidden="true" />
            导出
          </button>
        </div>
      </div>
      <div className="border-b border-zinc-200 bg-[#f7f7f4] px-3 py-2">
          <div className="flex flex-wrap gap-1.5">
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
      <div className="border-b border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-500">
        当前显示 {visibleAssets.length} / {scopedAssets.length} 个素材
      </div>
      {visibleAssets.length > 0 ? (
        <div className="grid max-h-[calc(100vh-230px)] grid-cols-3 gap-2 overflow-y-auto bg-[#f2f3ef] p-2">
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
        <div className="m-3 rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm leading-6 text-zinc-600">
          {emptyStateText({
            assetCount: assets.length,
            hasActiveFilters,
            scopedAssetCount: scopedAssets.length,
            viewMode
          })}
        </div>
      )}
      {isExportDialogOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/55 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-xl shadow-zinc-950/25">
            <div className="flex items-start justify-between gap-4 border-b border-zinc-200 bg-[#f7f7f4] px-4 py-3">
              <div>
                <h3 className="text-base font-semibold text-zinc-950">确认导出素材包</h3>
                <p className="mt-1 text-sm text-zinc-600">{exportLabel}</p>
              </div>
              <button
                aria-label="关闭导出确认"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50"
                onClick={() => setIsExportDialogOpen(false)}
                type="button"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            <div className="space-y-4 p-4">
              <div className="rounded-md border border-sky-200 bg-sky-50 px-3 py-2 text-sm leading-6 text-sky-900">
                当前范围：{exportMode === "selected" ? "已选素材" : "全部素材"}。ZIP 将包含素材文件、
                metadata.json 和 prompts.json。
              </div>
              {exportError ? (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                  {exportError}
                </div>
              ) : null}
              <div className="rounded-md border border-zinc-200 bg-[#fbfbf8] p-3">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-900">
                  <FileArchive size={16} className="text-sky-700" aria-hidden="true" />
                  spriteforge-export.zip
                </div>
                <div className="grid gap-2">
                  <ExportItem icon="image" label="assets/*.png" />
                  <ExportItem icon="json" label="metadata.json" />
                  <ExportItem icon="json" label="prompts.json" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="h-10 rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                  onClick={() => setIsExportDialogOpen(false)}
                  type="button"
                >
                  取消
                </button>
                <button
                  className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-800 disabled:bg-zinc-300 disabled:text-zinc-600"
                  disabled={isExporting}
                  onClick={handleExport}
                  type="button"
                >
                  <Archive size={16} aria-hidden="true" />
                  {isExporting ? "导出中..." : "确认导出 ZIP"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {isClearDialogOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/55 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-xl shadow-zinc-950/25">
            <div className="border-b border-zinc-200 bg-[#f7f7f4] px-4 py-3">
              <h3 className="text-base font-semibold text-zinc-950">确认清空素材库</h3>
              <p className="mt-1 text-sm text-zinc-600">该操作会删除当前本地素材库中的全部素材。</p>
            </div>
            <div className="space-y-4 p-4">
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                确认清空 {assets.length} 个素材？
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="h-10 rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                  onClick={() => setIsClearDialogOpen(false)}
                  type="button"
                >
                  取消
                </button>
                <button
                  className="h-10 rounded-md bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700"
                  onClick={() => {
                    onClearAssets();
                    setIsClearDialogOpen(false);
                  }}
                  type="button"
                >
                  确认清空
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

async function readJsonResponse(response: Response) {
  try {
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function readErrorMessage(payload: Record<string, unknown>, fallback: string) {
  return typeof payload.error === "string" && payload.error.trim() ? payload.error : fallback;
}

function ExportItem({ icon, label }: { icon: "image" | "json"; label: string }) {
  const Icon = icon === "image" ? FileImage : FileJson;

  return (
    <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm shadow-zinc-100">
      <Icon size={16} className="text-sky-700" aria-hidden="true" />
      {label}
    </div>
  );
}

function buttonClass(isActive: boolean) {
  return isActive
    ? "h-8 rounded-md border border-teal-500 bg-teal-50 px-2.5 text-xs font-semibold text-teal-800"
    : "h-8 rounded-md border border-transparent bg-white px-2.5 text-xs font-medium text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50";
}

function filterButtonClass(isActive: boolean) {
  return isActive
    ? "h-7 rounded-md border border-zinc-900 bg-zinc-900 px-2 text-xs font-medium text-white"
    : "h-7 rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50";
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
