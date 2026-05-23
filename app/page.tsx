import { AppHeader } from "@/components/AppHeader";
import { AssetForm } from "@/components/AssetForm";
import { AssetGallery } from "@/components/AssetGallery";
import { ExportPanel } from "@/components/ExportPanel";
import { PromptPreview } from "@/components/PromptPreview";
import { StyleProfilePanel } from "@/components/StyleProfilePanel";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-stone-50 text-zinc-950">
      <AppHeader />
      <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[390px_minmax(0,1fr)] lg:px-6">
        <aside className="space-y-5">
          <StyleProfilePanel />
          <AssetForm />
          <PromptPreview />
        </aside>
        <section className="space-y-5">
          <AssetGallery />
          <ExportPanel />
        </section>
      </div>
    </main>
  );
}
