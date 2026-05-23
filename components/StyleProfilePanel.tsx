import { Palette, RotateCcw } from "lucide-react";
import type { StyleProfile } from "@/lib/asset-schema";

type StyleProfilePanelProps = {
  appliedCount: number;
  onReset: () => void;
  onUpdateField: (field: keyof StyleProfile, value: string) => void;
  styleProfile: StyleProfile;
};

export function StyleProfilePanel({
  appliedCount,
  onReset,
  onUpdateField,
  styleProfile
}: StyleProfilePanelProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Palette size={18} className="text-amber-700" aria-hidden="true" />
          <div>
            <h2 className="text-base font-semibold text-zinc-950">Style Profile</h2>
            <p className="mt-1 text-sm text-zinc-600">Saved locally and injected into prompts</p>
          </div>
        </div>
        <button
          aria-label="Reset style profile"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 text-zinc-600 transition hover:border-amber-500 hover:text-amber-700"
          onClick={onReset}
          type="button"
        >
          <RotateCcw size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
        {appliedCount > 0
          ? `${appliedCount} style rule${appliedCount > 1 ? "s" : ""} active.`
          : "No style rules active yet."}
      </div>
      <div className="grid gap-3">
        <StyleInput
          field="projectName"
          label="Project"
          onUpdateField={onUpdateField}
          placeholder="Crystal Dungeon"
          value={styleProfile.projectName}
        />
        <StyleInput
          field="palette"
          label="Palette"
          onUpdateField={onUpdateField}
          placeholder="cyan, violet, deep navy"
          value={styleProfile.palette}
        />
        <StyleInput
          field="lineStyle"
          label="Line style"
          onUpdateField={onUpdateField}
          placeholder="thin bright outline"
          value={styleProfile.lineStyle}
        />
        <StyleInput
          field="lighting"
          label="Lighting"
          onUpdateField={onUpdateField}
          placeholder="soft rim light"
          value={styleProfile.lighting}
        />
        <StyleInput
          field="viewRule"
          label="View rule"
          onUpdateField={onUpdateField}
          placeholder="front-facing sprites"
          value={styleProfile.viewRule}
        />
        <StyleInput
          field="avoidElements"
          label="Avoid"
          onUpdateField={onUpdateField}
          placeholder="modern weapons, text, watermark"
          value={styleProfile.avoidElements}
        />
      </div>
    </section>
  );
}

function StyleInput({
  field,
  label,
  onUpdateField,
  placeholder,
  value
}: {
  field: keyof StyleProfile;
  label: string;
  onUpdateField: (field: keyof StyleProfile, value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-800">{label}</span>
      <input
        className="mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
        onChange={(event) => onUpdateField(field, event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}
