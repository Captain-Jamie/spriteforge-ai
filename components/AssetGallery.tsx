import { AssetCard } from "./AssetCard";
import type { AssetRecord } from "@/lib/asset-schema";

type AssetGalleryProps = {
  assets?: AssetRecord[];
};

export function AssetGallery({ assets = [] }: AssetGalleryProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-zinc-950">Asset Library</h2>
          <p className="mt-1 text-sm text-zinc-600">Generated records and export selection</p>
        </div>
        <div className="flex gap-2">
          <button className="h-9 rounded-md border border-zinc-300 px-3 text-sm text-zinc-700 hover:bg-zinc-50">
            All
          </button>
          <button className="h-9 rounded-md border border-zinc-300 px-3 text-sm text-zinc-700 hover:bg-zinc-50">
            Selected
          </button>
        </div>
      </div>
      {assets.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {assets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm leading-6 text-zinc-600">
          Generated mock assets will appear here after submitting a valid request.
        </div>
      )}
    </section>
  );
}
