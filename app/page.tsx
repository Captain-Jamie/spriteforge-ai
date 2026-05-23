"use client";

import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AssetForm } from "@/components/AssetForm";
import { AssetGallery } from "@/components/AssetGallery";
import { ExportPanel } from "@/components/ExportPanel";
import { PromptPreview } from "@/components/PromptPreview";
import { StyleProfilePanel } from "@/components/StyleProfilePanel";
import { useAssets } from "@/hooks/use-assets";
import type { GenerateApiResponse, GenerateAssetRequest, PromptBuildResult } from "@/lib/asset-schema";

export default function HomePage() {
  const {
    addAssets,
    assets,
    clearAssets,
    removeAsset,
    selectedAssetIds,
    toggleSelectAsset
  } = useAssets();
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mode, setMode] = useState<GenerateApiResponse["mode"] | null>(null);
  const [prompt, setPrompt] = useState<PromptBuildResult | null>(null);

  async function handleGenerate(request: GenerateAssetRequest) {
    setError(null);
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to generate assets");
      }

      const result = payload as GenerateApiResponse;
      addAssets(result.assets);
      setMode(result.mode);
      setPrompt(result.prompt);
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : "Failed to generate assets");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 text-zinc-950">
      <AppHeader />
      <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[390px_minmax(0,1fr)] lg:px-6">
        <aside className="space-y-5">
          <StyleProfilePanel />
          <AssetForm isGenerating={isGenerating} onSubmit={handleGenerate} />
          <PromptPreview error={error} isGenerating={isGenerating} mode={mode} prompt={prompt} />
        </aside>
        <section className="space-y-5">
          <AssetGallery
            assets={assets}
            onClearAssets={clearAssets}
            onRemoveAsset={removeAsset}
            onToggleSelectAsset={toggleSelectAsset}
            selectedAssetIds={selectedAssetIds}
          />
          <ExportPanel />
        </section>
      </div>
    </main>
  );
}
