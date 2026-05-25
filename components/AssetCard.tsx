import { Check, Clipboard, Download, ImageIcon, Trash2 } from "lucide-react";
import type { AssetRecord } from "@/lib/asset-schema";
import { ART_STYLE_LABELS, ASSET_TYPE_LABELS } from "@/lib/constants";
import { buildAssetFileName, copyToClipboard, downloadUrl } from "@/lib/file-utils";

const toneClasses = {
  teal: "border-teal-200 text-teal-800",
  amber: "border-amber-200 text-amber-800",
  sky: "border-sky-200 text-sky-800"
};

type AssetCardProps = {
  asset: AssetRecord;
  isFocused?: boolean;
  isSelected: boolean;
  onFocus?: () => void;
  onRemove: () => void;
  onToggleSelect: () => void;
};

export function AssetCard({
  asset,
  isFocused = false,
  isSelected,
  onFocus,
  onRemove,
  onToggleSelect
}: AssetCardProps) {
  const tone = getTone(asset.assetType);

  async function handleCopyPrompt() {
    await copyToClipboard(asset.prompt);
  }

  function handleDownload() {
    downloadUrl(asset.imageUrl, buildAssetFileName(asset));
  }

  return (
    <article
      className={`group overflow-hidden rounded-md border bg-white transition ${
        isSelected
          ? "border-teal-500 shadow-sm shadow-teal-950/10 ring-2 ring-teal-100"
          : isFocused
            ? "border-zinc-900 shadow-sm shadow-zinc-950/10 ring-2 ring-zinc-200"
            : "border-zinc-200 hover:border-zinc-400 hover:shadow-sm"
      }`}
    >
      <button
        className="mini-checker flex aspect-[4/3] w-full items-center justify-center border-b border-zinc-200 p-2"
        onClick={onFocus}
        type="button"
      >
        <div
          className={`flex h-full max-h-28 w-full max-w-28 items-center justify-center rounded-md border bg-transparent shadow-sm transition group-hover:scale-[1.02] ${toneClasses[tone]}`}
        >
          {asset.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt={asset.name} className="h-full w-full rounded-md object-contain" src={asset.imageUrl} />
          ) : (
            <ImageIcon size={34} aria-hidden="true" />
          )}
        </div>
      </button>
      <div className="space-y-2 p-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-xs font-semibold text-zinc-950">{asset.name}</h3>
            <p className="mt-0.5 truncate text-[11px] text-zinc-500">
              {ASSET_TYPE_LABELS[asset.assetType]} · {ART_STYLE_LABELS[asset.style]} · {asset.size}
            </p>
            {isFocused ? (
              <span className="sr-only">当前预览</span>
            ) : null}
          </div>
          <button
            aria-pressed={isSelected}
            className={`flex h-8 w-8 items-center justify-center rounded-md border ${
              isSelected
                ? "border-teal-700 bg-teal-700 text-white"
                : "border-zinc-300 text-zinc-600 hover:bg-zinc-50"
            }`}
            onClick={onToggleSelect}
            type="button"
          >
            <Check size={15} aria-hidden="true" />
            <span className="sr-only">选择素材</span>
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <button
            className="inline-flex h-7 items-center justify-center gap-1.5 rounded-md border border-zinc-300 text-xs font-medium text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50"
            onClick={handleDownload}
            type="button"
          >
            <Download size={15} aria-hidden="true" />
            <span className="sr-only">PNG</span>
          </button>
          <button
            className="inline-flex h-7 items-center justify-center gap-1.5 rounded-md border border-zinc-300 text-xs font-medium text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50"
            onClick={handleCopyPrompt}
            type="button"
          >
            <Clipboard size={15} aria-hidden="true" />
            <span className="sr-only">Prompt</span>
          </button>
          <button
            className="inline-flex h-7 items-center justify-center gap-1.5 rounded-md border border-red-200 text-xs font-medium text-red-700 hover:border-red-300 hover:bg-red-50"
            onClick={onRemove}
            type="button"
          >
            <Trash2 size={15} aria-hidden="true" />
            <span className="sr-only">删除</span>
          </button>
        </div>
      </div>
    </article>
  );
}

function getTone(assetType: AssetRecord["assetType"]): keyof typeof toneClasses {
  if (assetType === "item" || assetType === "ui") {
    return "amber";
  }

  if (assetType === "icon" || assetType === "background") {
    return "sky";
  }

  return "teal";
}
