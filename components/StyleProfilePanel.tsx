import { Palette } from "lucide-react";

export function StyleProfilePanel() {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Palette size={18} className="text-amber-700" aria-hidden="true" />
        <h2 className="text-base font-semibold text-zinc-950">Style Profile</h2>
      </div>
      <div className="grid gap-3">
        <StaticInput label="Project" value="Crystal Dungeon" />
        <StaticInput label="Palette" value="cyan, violet, deep navy" />
        <StaticInput label="Line style" value="thin bright outline" />
        <StaticInput label="View rule" value="front-facing sprites" />
      </div>
    </section>
  );
}

function StaticInput({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-800">{label}</span>
      <input
        className="mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
        defaultValue={value}
      />
    </label>
  );
}
