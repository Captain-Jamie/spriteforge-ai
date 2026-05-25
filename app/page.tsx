"use client";

import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AssetForm } from "@/components/AssetForm";
import { AssetGallery } from "@/components/AssetGallery";
import { ExportPanel } from "@/components/ExportPanel";
import { PromptPreview } from "@/components/PromptPreview";
import { StyleProfilePanel } from "@/components/StyleProfilePanel";
import type { GenerateAssetRequest } from "@/lib/asset-schema";

export default function HomePage() {
  const [latestRequest, setLatestRequest] = useState<GenerateAssetRequest | null>(null);

  return (
    <main className="min-h-screen bg-stone-50 text-zinc-950">
      <AppHeader />
      <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[390px_minmax(0,1fr)] lg:px-6">
        <aside className="space-y-5">
          <StyleProfilePanel />
          <AssetForm onSubmit={setLatestRequest} />
          <PromptPreview request={latestRequest} />
        </aside>
        <section className="space-y-5">
          <AssetGallery />
          <ExportPanel />
        </section>
      </div>
    </main>
  );
}
