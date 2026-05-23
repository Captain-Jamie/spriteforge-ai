import { AssetCard } from "./AssetCard";

const sampleAssets = [
  {
    name: "fire_slime",
    type: "Character",
    style: "Pixel Art",
    size: "128x128",
    tone: "teal"
  },
  {
    name: "magic_potion",
    type: "Item",
    style: "Pixel Art",
    size: "128x128",
    tone: "amber"
  },
  {
    name: "grass_tile",
    type: "Tile",
    style: "Pixel Art",
    size: "64x64",
    tone: "sky"
  }
] as const;

export function AssetGallery() {
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
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {sampleAssets.map((asset) => (
          <AssetCard key={asset.name} {...asset} />
        ))}
      </div>
    </section>
  );
}
