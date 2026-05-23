"use client";

import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AssetForm } from "@/components/AssetForm";
import { AssetGallery } from "@/components/AssetGallery";
import { CurrentPreview } from "@/components/CurrentPreview";
import { ExportPanel } from "@/components/ExportPanel";
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
  const focusedAsset = assets.find((asset) => asset.id === focusedAssetId) ?? assets[0] ?? null;

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

  function handleClearAssets() {
    clearAssets();
    setFocusedAssetId(null);
  }

  return (
    <main className="min-h-screen bg-[#f4f5f2] text-zinc-950">
      <AppHeader />
      <div className="mx-auto grid w-full max-w-[1500px] gap-4 px-4 py-4 xl:grid-cols-[360px_minmax(420px,1fr)_390px] xl:px-6">
        <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
          <StyleProfilePanel
            appliedCount={appliedStyleProfile}
            onReset={resetStyleProfile}
            onUpdateField={updateStyleProfileField}
            styleProfile={styleProfile}
          />
          <AssetForm isGenerating={isGenerating} onSubmit={handleGenerate} />
        </aside>
        <section className="space-y-4">
          <CurrentPreview
            asset={focusedAsset}
            isSelected={focusedAsset ? selectedAssetIds.includes(focusedAsset.id) : false}
            onRemove={focusedAsset ? () => handleRemoveAsset(focusedAsset.id) : undefined}
            onToggleSelect={focusedAsset ? () => toggleSelectAsset(focusedAsset.id) : undefined}
          />
          <PromptPreview error={error} isGenerating={isGenerating} mode={mode} prompt={prompt} />
        </section>
        <section className="space-y-4 xl:sticky xl:top-4 xl:self-start">
          <AssetGallery
            assets={assets}
            focusedAssetId={focusedAsset?.id}
            onClearAssets={handleClearAssets}
            onFocusAsset={setFocusedAssetId}
            onRemoveAsset={handleRemoveAsset}
            onToggleSelectAsset={toggleSelectAsset}
            selectedAssetIds={selectedAssetIds}
          />
          <ExportPanel assets={assets} selectedAssets={selectedAssets} styleProfile={styleProfile} />
        </section>
      </div>
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
