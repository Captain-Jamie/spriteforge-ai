import { Sparkles } from "lucide-react";
import {
  ART_STYLE_LABELS,
  ASSET_SIZES,
  ASSET_TYPE_LABELS,
  BACKGROUND_LABELS,
  GAME_GENRE_LABELS,
  VIEW_LABELS
} from "@/lib/constants";

export function AssetForm() {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-zinc-950">Asset Request</h2>
          <p className="mt-1 text-sm text-zinc-600">Structured controls for game-ready output</p>
        </div>
        <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
          PR2 static
        </span>
      </div>

      <form className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Description</span>
          <textarea
            className="mt-1 min-h-24 w-full resize-none rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            defaultValue="Fire slime monster"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <SelectField label="Asset type" values={ASSET_TYPE_LABELS} />
          <SelectField label="Art style" values={ART_STYLE_LABELS} />
          <SelectField label="Game genre" values={GAME_GENRE_LABELS} />
          <SelectField label="View" values={VIEW_LABELS} />
          <label className="block">
            <span className="text-sm font-medium text-zinc-800">Size</span>
            <select className="mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100">
              {ASSET_SIZES.map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
          </label>
          <SelectField label="Background" values={BACKGROUND_LABELS} />
        </div>

        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Count</span>
          <input
            className="mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            defaultValue="2"
            inputMode="numeric"
          />
        </label>

        <button
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800"
          type="button"
        >
          <Sparkles size={17} aria-hidden="true" />
          Generate Assets
        </button>
      </form>
    </section>
  );
}

function SelectField({
  label,
  values
}: {
  label: string;
  values: Record<string, string>;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-800">{label}</span>
      <select className="mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100">
        {Object.entries(values).map(([value, labelText]) => (
          <option key={value} value={value}>
            {labelText}
          </option>
        ))}
      </select>
    </label>
  );
}
