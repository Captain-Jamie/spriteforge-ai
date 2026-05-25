"use client";

import { Archive, FileJson, FolderDown } from "lucide-react";
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
      return "No assets ready";
    }

    return selectedAssets.length > 0
      ? `Export selected (${selectedAssets.length})`
      : `Export all (${assets.length})`;
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
        const payload = await response.json();
        throw new Error(payload.error ?? "Failed to export package");
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
      setError(exportError instanceof Error ? exportError.message : "Failed to export package");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <FolderDown size={18} className="text-sky-700" aria-hidden="true" />
          <div>
            <h2 className="text-base font-semibold text-zinc-950">Export Package</h2>
            <p className="mt-1 text-sm text-zinc-600">PNG assets with metadata and prompts</p>
          </div>
        </div>
        <button
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-800 disabled:bg-zinc-300 disabled:text-zinc-600"
          disabled={exportAssets.length === 0 || isExporting}
          onClick={handleExport}
          type="button"
        >
          <Archive size={17} aria-hidden="true" />
          {isExporting ? "Exporting..." : "Export ZIP"}
        </button>
      </div>

      <div className="mb-4 rounded-md border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-900">
        {exportLabel}. Current mode: {exportMode}.
      </div>
      {error ? (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
        <pre className="overflow-auto rounded-md border border-zinc-200 bg-zinc-950 p-4 text-sm leading-6 text-zinc-100">
{`spriteforge-export/
  assets/
    character_fire_slime_128.png
    item_magic_potion_128.png
  metadata.json
  prompts.json`}
        </pre>
        <div className="grid content-start gap-2">
          <ExportItem label="metadata.json" />
          <ExportItem label="prompts.json" />
          <ExportItem label="assets/*.png" />
        </div>
      </div>
    </section>
  );
}

function ExportItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
      <FileJson size={16} className="text-sky-700" aria-hidden="true" />
      {label}
    </div>
  );
}
