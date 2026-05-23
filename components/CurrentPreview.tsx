"use client";

import { Check, Clipboard, Download, ImageIcon, Trash2 } from "lucide-react";
import type { AssetRecord } from "@/lib/asset-schema";
import {
  ART_STYLE_LABELS,
  ASSET_TYPE_LABELS,
  BACKGROUND_LABELS,
  GAME_GENRE_LABELS,
  VIEW_LABELS
} from "@/lib/constants";
import { buildAssetFileName, copyToClipboard, downloadUrl } from "@/lib/file-utils";

type CurrentPreviewProps = {
  asset?: AssetRecord | null;
  isSelected: boolean;
  onRemove?: () => void;
  onToggleSelect?: () => void;
};

export function CurrentPreview({
  asset,
  isSelected,
  onRemove,
  onToggleSelect
}: CurrentPreviewProps) {
  async function handleCopyPrompt() {
    if (!asset) {
      return;
    }

    await copyToClipboard(asset.prompt);
  }

  function handleDownload() {
    if (!asset) {
      return;
    }

    downloadUrl(asset.imageUrl, buildAssetFileName(asset));
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-200/70">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-zinc-950">当前生成结果</h2>
          <p className="mt-1 text-sm text-zinc-600">
            {asset ? "查看当前聚焦素材的预览与交付信息" : "生成或点击素材后，这里会显示主预览"}
          </p>
        </div>
        {asset ? (
          <div className="flex flex-wrap gap-2">
            <button className={actionButtonClass()} onClick={handleDownload} type="button">
              <Download size={16} aria-hidden="true" />
              下载
            </button>
            <button className={actionButtonClass()} onClick={handleCopyPrompt} type="button">
              <Clipboard size={16} aria-hidden="true" />
              复制 Prompt
            </button>
          </div>
        ) : null}
      </div>

      {asset ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(260px,1fr)_260px]">
          <div className="flex min-h-[420px] items-center justify-center rounded-lg border border-zinc-200 bg-[linear-gradient(45deg,#f4f4f5_25%,transparent_25%),linear-gradient(-45deg,#f4f4f5_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f4f4f5_75%),linear-gradient(-45deg,transparent_75%,#f4f4f5_75%)] bg-[length:24px_24px] bg-[position:0_0,0_12px,12px_-12px,-12px_0px] p-6">
            <div className="flex h-full max-h-[360px] w-full max-w-[360px] items-center justify-center rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={asset.name} className="h-full w-full object-contain" src={asset.imageUrl} />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <h3 className="break-words text-lg font-semibold leading-6 text-zinc-950">{asset.name}</h3>
              <p className="mt-1 text-sm text-zinc-500">{new Date(asset.createdAt).toLocaleString()}</p>
            </div>
            <div className="grid gap-2">
              <MetadataItem label="素材类型" value={ASSET_TYPE_LABELS[asset.assetType]} />
              <MetadataItem label="美术风格" value={ART_STYLE_LABELS[asset.style]} />
              <MetadataItem label="游戏类型" value={GAME_GENRE_LABELS[asset.gameGenre]} />
              <MetadataItem label="视角" value={VIEW_LABELS[asset.view]} />
              <MetadataItem label="尺寸" value={asset.size} />
              <MetadataItem label="背景" value={BACKGROUND_LABELS[asset.background]} />
            </div>
            <div className="grid gap-2 pt-2">
              <button
                className={
                  isSelected
                    ? "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-teal-700 bg-teal-700 px-3 text-sm font-semibold text-white"
                    : "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                }
                onClick={onToggleSelect}
                type="button"
              >
                <Check size={16} aria-hidden="true" />
                {isSelected ? "已加入导出选择" : "加入导出选择"}
              </button>
              <button
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-red-200 bg-white px-3 text-sm font-semibold text-red-700 hover:bg-red-50"
                onClick={onRemove}
                type="button"
              >
                <Trash2 size={16} aria-hidden="true" />
                删除素材
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid min-h-[420px] place-items-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center">
          <div>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-500 shadow-sm">
              <ImageIcon size={28} aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold text-zinc-950">暂无当前素材</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-600">
              生成素材后，最新结果会自动显示在这里。你也可以点击素材库中的卡片切换预览。
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

function MetadataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm">
      <span className="text-zinc-500">{label}</span>
      <span className="font-medium text-zinc-900">{value}</span>
    </div>
  );
}

function actionButtonClass() {
  return "inline-flex h-9 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50";
}
