"use client";

import { Braces, Download, ImageIcon } from "lucide-react";
import type { AssetRecord } from "@/lib/asset-schema";
import {
  ART_STYLE_LABELS,
  ASSET_TYPE_LABELS,
  BACKGROUND_LABELS
} from "@/lib/constants";
import { buildAssetFileName, downloadUrl } from "@/lib/file-utils";

type CurrentPreviewProps = {
  asset?: AssetRecord | null;
  assets?: AssetRecord[];
  focusedAssetId?: string | null;
  onFocusAsset?: (assetId: string) => void;
  onOpenPrompt?: () => void;
};

export function CurrentPreview({
  asset,
  assets = [],
  focusedAssetId,
  onFocusAsset,
  onOpenPrompt
}: CurrentPreviewProps) {
  function handleDownload() {
    if (!asset) {
      return;
    }

    downloadUrl(asset.imageUrl, buildAssetFileName(asset));
  }

  const batchAssets = asset
    ? assets.filter((item) =>
        asset.batchId ? item.batchId === asset.batchId : item.createdAt === asset.createdAt
      )
    : [];

  return (
    <section className="overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-sm shadow-zinc-300/80">
      <div className="flex flex-col gap-3 border-b border-zinc-200 bg-[#f7f7f4] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-zinc-950">素材详情</h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            {asset ? "查看当前聚焦素材的预览与交付信息" : "生成或点击素材后，这里会显示主预览"}
          </p>
        </div>
        {asset ? (
          <div className="flex flex-wrap gap-2">
            <button className={actionButtonClass()} onClick={handleDownload} type="button">
              <Download size={16} aria-hidden="true" />
              下载
            </button>
            {onOpenPrompt ? (
              <button className={actionButtonClass()} onClick={onOpenPrompt} type="button">
                <Braces size={16} aria-hidden="true" />
                查看Prompt
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      {asset ? (
        <div>
          <div className="border-b border-zinc-200 bg-[#171a1d] p-3">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-300">
              <span className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1">预览画布</span>
              <div className="flex flex-wrap gap-1.5">
                <Badge>{ASSET_TYPE_LABELS[asset.assetType]}</Badge>
                <Badge>{ART_STYLE_LABELS[asset.style]}</Badge>
                <Badge>{asset.size}</Badge>
                <Badge>{BACKGROUND_LABELS[asset.background]}</Badge>
              </div>
            </div>
            <div className="canvas-checker flex min-h-[430px] items-center justify-center rounded-md border border-zinc-700 p-6 shadow-inner">
              <div className="flex h-full max-h-[380px] w-full max-w-[380px] items-center justify-center bg-transparent p-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={asset.name} className="h-full w-full object-contain" src={asset.imageUrl} />
              </div>
            </div>
          </div>
          <div className="space-y-3 bg-[#fbfbf8] p-3">
            {batchAssets.length > 0 ? (
              <div className="flex gap-2 overflow-x-auto rounded-md border border-zinc-200 bg-white p-2">
                {batchAssets.map((item) => (
                  <button
                    className={`mini-checker flex h-16 w-16 shrink-0 items-center justify-center rounded-md border p-1 transition ${
                      (focusedAssetId ?? asset.id) === item.id
                        ? "border-teal-600 ring-2 ring-teal-100"
                        : "border-zinc-200 hover:border-zinc-400"
                    }`}
                    key={item.id}
                    onClick={() => onFocusAsset?.(item.id)}
                    type="button"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt={item.name} className="h-full w-full object-contain" src={item.imageUrl} />
                  </button>
                ))}
              </div>
            ) : null}
            </div>
        </div>
      ) : (
        <div className="canvas-checker m-3 grid min-h-[430px] place-items-center rounded-md border border-dashed border-zinc-400 p-6 text-center">
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

function Badge({ children }: { children: string }) {
  return (
    <span className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-200">
      {children}
    </span>
  );
}

function actionButtonClass() {
  return "inline-flex h-9 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 shadow-sm hover:border-zinc-400 hover:bg-zinc-50";
}
