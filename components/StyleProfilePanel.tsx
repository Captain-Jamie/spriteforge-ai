import { Palette, RotateCcw, X } from "lucide-react";
import type { StyleProfile } from "@/lib/asset-schema";

type StyleProfilePanelProps = {
  appliedCount: number;
  onClose?: () => void;
  onReset: () => void;
  onUpdateField: (field: keyof StyleProfile, value: string) => void;
  styleProfile: StyleProfile;
};

export function StyleProfilePanel({
  appliedCount,
  onClose,
  onReset,
  onUpdateField,
  styleProfile
}: StyleProfilePanelProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-sm shadow-zinc-300/80">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 bg-[#181b1f] px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <Palette size={18} className="text-amber-300" aria-hidden="true" />
          <div>
            <h2 className="text-base font-semibold">项目风格档案</h2>
            <p className="mt-0.5 text-xs text-zinc-400">自动保存并注入 Prompt</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="重置风格档案"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 text-zinc-300 transition hover:border-amber-300 hover:text-amber-200"
            onClick={onReset}
            type="button"
          >
            <RotateCcw size={16} aria-hidden="true" />
          </button>
          {onClose ? (
            <button
              aria-label="关闭风格档案"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 text-zinc-300 transition hover:border-zinc-500 hover:text-white"
              onClick={onClose}
              type="button"
            >
              <X size={16} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
        {appliedCount > 0 ? `${appliedCount} 条风格规则生效` : "尚未设置风格规则"}
      </div>
      <div className="grid gap-3 p-4">
        <StyleInput
          field="projectName"
          label="项目名称"
          onUpdateField={onUpdateField}
          placeholder="Crystal Dungeon"
          value={styleProfile.projectName}
        />
        <StyleInput
          field="palette"
          label="配色方案"
          onUpdateField={onUpdateField}
          placeholder="cyan, violet, deep navy"
          value={styleProfile.palette}
        />
        <StyleInput
          field="lineStyle"
          label="线条风格"
          onUpdateField={onUpdateField}
          placeholder="thin bright outline"
          value={styleProfile.lineStyle}
        />
        <StyleInput
          field="lighting"
          label="光照规则"
          onUpdateField={onUpdateField}
          placeholder="soft rim light"
          value={styleProfile.lighting}
        />
        <StyleInput
          field="viewRule"
          label="视角规则"
          onUpdateField={onUpdateField}
          placeholder="front-facing sprites"
          value={styleProfile.viewRule}
        />
        <StyleInput
          field="avoidElements"
          label="避免元素"
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
      <span className="text-xs font-semibold text-zinc-600">{label}</span>
      <input
        className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-[#fbfbf8] px-3 text-sm text-zinc-800 outline-none transition focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-100"
        onChange={(event) => onUpdateField(field, event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}
