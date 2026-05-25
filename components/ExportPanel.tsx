"use client";

import { Archive, FileArchive, FileImage, FileJson, FolderDown } from "lucide-react";
import { useMemo, useState } from "react";
import type { AssetRecord, StyleProfile } from "@/lib/asset-schema";

type ExportPanelProps = {
  assets: AssetRecord[];
  selectedAssets: AssetRecord[];
  styleProfile?: StyleProfile;
};

export function ExportPanel({ assets, selectedAssets, styleProfile }: ExportPanelProps) {
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
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

  async function handleExport() {
    if (exportAssets.length === 0) {
      return;
    }

    setError(null);
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
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : "导出素材包失败");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-200/70">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <FolderDown size={18} className="text-sky-700" aria-hidden="true" />
          <div>
            <h2 className="text-base font-semibold text-zinc-950">导出素材包</h2>
            <p className="mt-1 text-sm text-zinc-600">素材文件、metadata 与 prompts</p>
          </div>
        </div>
        <button
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-800 disabled:bg-zinc-300 disabled:text-zinc-600"
          disabled={exportAssets.length === 0 || isExporting}
          onClick={handleExport}
          type="button"
        >
          <Archive size={17} aria-hidden="true" />
          {isExporting ? "导出中..." : "导出 ZIP"}
        </button>
      </div>

      <div className="mb-4 rounded-md border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-900">
        {exportLabel}。当前范围：{exportMode === "selected" ? "已选素材" : "全部素材"}。
      </div>
      {error ? (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
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
    <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700">
      <Icon size={16} className="text-sky-700" aria-hidden="true" />
      {label}
    </div>
  );
}
