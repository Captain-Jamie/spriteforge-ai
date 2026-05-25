"use client";

import { Palette } from "lucide-react";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AssetForm } from "@/components/AssetForm";
import { AssetGallery } from "@/components/AssetGallery";
import { CurrentPreview } from "@/components/CurrentPreview";
import { PromptPreview } from "@/components/PromptPreview";
import { StyleProfilePanel } from "@/components/StyleProfilePanel";
import { useAssets } from "@/hooks/use-assets";
import { useStyleProfile } from "@/hooks/use-style-profile";
import type {
  AssetRecord,
  GenerateApiResponse,
  GenerateAssetRequest,
  PromptBuildResult
} from "@/lib/asset-schema";

export default function HomePage() {
  const {
    addAssets,
    assets,
    clearAssets,
    removeAsset,
    selectedAssets,
    selectedAssetIds,
    toggleSelectAsset
  } = useAssets();
  const { appliedStyleProfile, resetStyleProfile, styleProfile, updateStyleProfileField } =
    useStyleProfile();
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mode, setMode] = useState<GenerateApiResponse["mode"] | null>(null);
  const [prompt, setPrompt] = useState<PromptBuildResult | null>(null);
  const [focusedAssetId, setFocusedAssetId] = useState<string | null>(null);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [isStyleProfileOpen, setIsStyleProfileOpen] = useState(false);
  const [assetPendingDelete, setAssetPendingDelete] = useState<AssetRecord | null>(null);
  const focusedAsset = assets.find((asset) => asset.id === focusedAssetId) ?? assets[0] ?? null;
  const focusedPrompt: PromptBuildResult | null = focusedAsset
    ? {
        positivePrompt: focusedAsset.prompt,
        negativePrompt: focusedAsset.negativePrompt,
        appliedStyleProfile: prompt?.appliedStyleProfile ?? []
      }
    : prompt;

  async function handleGenerate(request: GenerateAssetRequest) {
    setError(null);
    setIsGenerating(true);
    const requestWithStyleProfile: GenerateAssetRequest = {
      ...request,
      styleProfile
    };

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestWithStyleProfile)
      });

      const payload = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(readErrorMessage(payload, "Failed to generate assets"));
      }

      const result = payload as GenerateApiResponse;
      addAssets(result.assets);
      setFocusedAssetId(result.assets[0]?.id ?? null);
      setMode(result.mode);
      setPrompt(result.prompt);
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : "Failed to generate assets");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleRemoveAsset(assetId: string) {
    removeAsset(assetId);

    if (focusedAssetId === assetId) {
      setFocusedAssetId(findNextFocusedAssetId(assets, assetId));
    }
  }

  function handleConfirmDeleteAsset() {
    if (!assetPendingDelete) {
      return;
    }

    handleRemoveAsset(assetPendingDelete.id);
    setAssetPendingDelete(null);
  }

  function handleClearAssets() {
    clearAssets();
    setFocusedAssetId(null);
  }

  return (
    <main className="workbench-bg min-h-screen text-zinc-950">
      <AppHeader />
      <div className="mx-auto grid w-full max-w-[1600px] gap-3 px-3 py-3 xl:grid-cols-[320px_minmax(620px,1fr)_420px] xl:px-4">
        <aside className="space-y-3 xl:sticky xl:top-3 xl:self-start">
          <button
            className="flex w-full items-center justify-between gap-3 rounded-lg border border-zinc-300 bg-white p-4 text-left shadow-sm shadow-zinc-300/80 transition hover:border-amber-400 hover:bg-amber-50"
            onClick={() => setIsStyleProfileOpen(true)}
            type="button"
          >
            <span className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-amber-200 bg-amber-50 text-amber-700">
                <Palette size={20} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-base font-semibold text-zinc-950">项目风格档案</span>
                <span className="mt-0.5 block text-xs text-zinc-500">
                  {appliedStyleProfile > 0 ? `${appliedStyleProfile} 条规则生效` : "点击配置项目风格规则"}
                </span>
              </span>
            </span>
            <span className="rounded-md border border-zinc-300 bg-[#f7f7f4] px-2.5 py-1 text-xs font-medium text-zinc-700">
              配置
            </span>
          </button>
          <AssetForm isGenerating={isGenerating} onSubmit={handleGenerate} />
        </aside>
        <section className="space-y-3">
          <CurrentPreview
            asset={focusedAsset}
            assets={assets}
            focusedAssetId={focusedAsset?.id}
            onFocusAsset={setFocusedAssetId}
            onOpenPrompt={focusedAsset ? () => setIsPromptOpen(true) : undefined}
          />
          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 shadow-sm">
              {error}
            </div>
          ) : null}
          {isGenerating ? (
            <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900 shadow-sm">
              正在生成素材...
            </div>
          ) : null}
        </section>
        <section className="space-y-3 xl:sticky xl:top-3 xl:self-start">
          <AssetGallery
            assets={assets}
            focusedAssetId={focusedAsset?.id}
            onClearAssets={handleClearAssets}
            onFocusAsset={setFocusedAssetId}
            onRemoveAsset={(assetId) => {
              const targetAsset = assets.find((asset) => asset.id === assetId);
              if (targetAsset) {
                setAssetPendingDelete(targetAsset);
              }
            }}
            onToggleSelectAsset={toggleSelectAsset}
            selectedAssets={selectedAssets}
            selectedAssetIds={selectedAssetIds}
            styleProfile={styleProfile}
          />
        </section>
      </div>
      {isPromptOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/55 p-4">
          <div className="max-h-[88vh] w-full max-w-3xl overflow-y-auto">
            <PromptPreview
              error={error}
              isGenerating={isGenerating}
              mode={mode}
              onClose={() => setIsPromptOpen(false)}
              prompt={focusedPrompt}
            />
          </div>
        </div>
      ) : null}
      {assetPendingDelete ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/55 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-xl shadow-zinc-950/25">
            <div className="border-b border-zinc-200 bg-[#f7f7f4] px-4 py-3">
              <h3 className="text-base font-semibold text-zinc-950">确认删除素材</h3>
              <p className="mt-1 text-sm text-zinc-600">删除后会从本地素材库中移除。</p>
            </div>
            <div className="space-y-4 p-4">
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                确认删除 `{assetPendingDelete.name}`？
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="h-10 rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                  onClick={() => setAssetPendingDelete(null)}
                  type="button"
                >
                  取消
                </button>
                <button
                  className="h-10 rounded-md bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700"
                  onClick={handleConfirmDeleteAsset}
                  type="button"
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {isStyleProfileOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/55 p-4">
          <div className="w-full max-w-xl">
            <StyleProfilePanel
              appliedCount={appliedStyleProfile}
              onClose={() => setIsStyleProfileOpen(false)}
              onReset={resetStyleProfile}
              onUpdateField={updateStyleProfileField}
              styleProfile={styleProfile}
            />
          </div>
        </div>
      ) : null}
    </main>
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

function findNextFocusedAssetId(assets: AssetRecord[], removedAssetId: string) {
  const removedIndex = assets.findIndex((asset) => asset.id === removedAssetId);

  if (removedIndex < 0) {
    return assets[0]?.id ?? null;
  }

  const nextAsset = assets[removedIndex + 1] ?? assets[removedIndex - 1];
  return nextAsset?.id ?? null;
}
