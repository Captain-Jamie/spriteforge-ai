import { Check, Clipboard, Download, ImageIcon, Trash2 } from "lucide-react";
import type { AssetRecord } from "@/lib/asset-schema";
import { ART_STYLE_LABELS, ASSET_TYPE_LABELS } from "@/lib/constants";
import { buildAssetFileName, copyToClipboard, downloadUrl } from "@/lib/file-utils";

const toneClasses = {
  teal: "border-teal-200 bg-teal-50 text-teal-800",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  sky: "border-sky-200 bg-sky-50 text-sky-800"
};

type AssetCardProps = {
  asset: AssetRecord;
  isSelected: boolean;
  onRemove: () => void;
  onToggleSelect: () => void;
};

export function AssetCard({ asset, isSelected, onRemove, onToggleSelect }: AssetCardProps) {
  const tone = getTone(asset.assetType);

  async function handleCopyPrompt() {
    await copyToClipboard(asset.prompt);
  }

  function handleDownload() {
    downloadUrl(asset.imageUrl, buildAssetFileName(asset));
  }

  return (
    <article
      className={`overflow-hidden rounded-lg border bg-white ${
        isSelected ? "border-teal-600 ring-2 ring-teal-100" : "border-zinc-200"
      }`}
    >
      <div className="flex aspect-square items-center justify-center bg-[linear-gradient(45deg,#f4f4f5_25%,transparent_25%),linear-gradient(-45deg,#f4f4f5_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f4f4f5_75%),linear-gradient(-45deg,transparent_75%,#f4f4f5_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px]">
        <div
          className={`flex h-24 w-24 items-center justify-center rounded-md border ${toneClasses[tone]}`}
        >
          {asset.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt={asset.name} className="h-full w-full rounded-md object-cover" src={asset.imageUrl} />
          ) : (
            <ImageIcon size={34} aria-hidden="true" />
          )}
        </div>
      </div>
      <div className="space-y-3 p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-zinc-950">{asset.name}</h3>
            <p className="mt-1 text-xs text-zinc-500">
              {ASSET_TYPE_LABELS[asset.assetType]} · {ART_STYLE_LABELS[asset.style]} · {asset.size}
            </p>
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
            <span className="sr-only">Select asset</span>
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-zinc-300 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            onClick={handleDownload}
            type="button"
          >
            <Download size={15} aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">PNG</span>
          </button>
          <button
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-zinc-300 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            onClick={handleCopyPrompt}
            type="button"
          >
            <Clipboard size={15} aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Prompt</span>
          </button>
          <button
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-red-200 text-sm font-medium text-red-700 hover:bg-red-50"
            onClick={onRemove}
            type="button"
          >
            <Trash2 size={15} aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Delete</span>
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
