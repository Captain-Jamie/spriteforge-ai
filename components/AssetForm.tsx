"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import type { GenerateAssetRequest, StyleProfile } from "@/lib/asset-schema";
import { GenerateAssetRequestSchema } from "@/lib/asset-schema";
import {
  ART_STYLE_LABELS,
  ASSET_SIZES,
  ASSET_TYPE_LABELS,
  BACKGROUND_LABELS,
  GAME_GENRE_LABELS,
  VIEW_LABELS
} from "@/lib/constants";

const defaultValues: GenerateAssetRequest = {
  description: "Fire slime monster",
  assetType: "character",
  style: "pixel_art",
  gameGenre: "rpg",
  view: "front",
  size: "128x128",
  background: "transparent",
  count: 2
};

type AssetFormProps = {
  appliedStyleProfile: number;
  isGenerating?: boolean;
  onResetStyleProfile: () => void;
  onSubmit: (request: GenerateAssetRequest) => void;
  onUpdateStyleProfileField: (field: keyof StyleProfile, value: string) => void;
  styleProfile: StyleProfile;
};

export function AssetForm({
  appliedStyleProfile,
  isGenerating = false,
  onResetStyleProfile,
  onSubmit,
  onUpdateStyleProfileField,
  styleProfile
}: AssetFormProps) {
  const [isStyleProfileOpen, setIsStyleProfileOpen] = useState(false);
  const {
    formState: { errors },
    handleSubmit,
    register
  } = useForm<GenerateAssetRequest>({
    defaultValues,
    resolver: zodResolver(GenerateAssetRequestSchema)
  });

  return (
    <section className="overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-sm shadow-zinc-300/80">
      <div className="border-b border-zinc-200 bg-[#f7f7f4] px-4 py-3">
        <div>
          <h2 className="text-base font-semibold text-zinc-950">素材需求</h2>
          <p className="mt-0.5 text-xs text-zinc-500">结构化生成参数</p>
        </div>
      </div>

      <form className="space-y-3 p-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="overflow-hidden rounded-md border border-amber-200 bg-amber-50/60">
          <button
            className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left"
            onClick={() => setIsStyleProfileOpen((current) => !current)}
            type="button"
          >
            <span>
              <span className="block text-xs font-semibold text-zinc-800">项目风格约束</span>
              <span className="mt-0.5 block text-xs text-amber-800">
                {appliedStyleProfile > 0
                  ? `${appliedStyleProfile} 条风格规则会注入 Prompt`
                  : "可选，高级美术一致性设置"}
              </span>
            </span>
            <ChevronDown
              aria-hidden="true"
              className={`text-amber-800 transition ${isStyleProfileOpen ? "rotate-180" : ""}`}
              size={17}
            />
          </button>
          {isStyleProfileOpen ? (
            <div className="grid gap-3 border-t border-amber-200 bg-white p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs leading-5 text-zinc-600">
                  基础需求决定生成什么，项目风格约束决定按什么美术规则生成。
                </p>
                <button
                  aria-label="重置风格约束"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50"
                  onClick={onResetStyleProfile}
                  type="button"
                >
                  <RotateCcw size={15} aria-hidden="true" />
                </button>
              </div>
              <StyleInput
                field="projectName"
                label="项目名称"
                onUpdateField={onUpdateStyleProfileField}
                placeholder="Crystal Dungeon"
                value={styleProfile.projectName}
              />
              <StyleInput
                field="palette"
                label="配色方案"
                onUpdateField={onUpdateStyleProfileField}
                placeholder="cyan, violet, deep navy"
                value={styleProfile.palette}
              />
              <StyleInput
                field="lineStyle"
                label="线条风格"
                onUpdateField={onUpdateStyleProfileField}
                placeholder="thin bright outline"
                value={styleProfile.lineStyle}
              />
              <StyleInput
                field="lighting"
                label="光照规则"
                onUpdateField={onUpdateStyleProfileField}
                placeholder="soft rim light"
                value={styleProfile.lighting}
              />
              <StyleInput
                field="viewRule"
                label="视角规则"
                onUpdateField={onUpdateStyleProfileField}
                placeholder="front-facing sprites"
                value={styleProfile.viewRule}
              />
              <StyleInput
                field="avoidElements"
                label="避免元素"
                onUpdateField={onUpdateStyleProfileField}
                placeholder="modern weapons, text, watermark"
                value={styleProfile.avoidElements}
              />
            </div>
          ) : null}
        </div>

        <label className="block">
          <span className="text-xs font-semibold text-zinc-600">素材描述</span>
          <textarea
            className="mt-1 min-h-24 w-full resize-none rounded-md border border-zinc-300 bg-[#fbfbf8] px-3 py-2 text-sm outline-none transition focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-100"
            {...register("description")}
          />
          <FieldError message={errors.description?.message} />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <SelectField
            label="素材类型"
            values={ASSET_TYPE_LABELS}
            registration={register("assetType")}
          />
          <SelectField label="美术风格" values={ART_STYLE_LABELS} registration={register("style")} />
          <SelectField label="游戏类型" values={GAME_GENRE_LABELS} registration={register("gameGenre")} />
          <SelectField label="视角" values={VIEW_LABELS} registration={register("view")} />
          <label className="block">
            <span className="text-sm font-medium text-zinc-800">尺寸</span>
            <select
              className="mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              {...register("size")}
            >
              {ASSET_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
          <SelectField
            label="背景"
            values={BACKGROUND_LABELS}
            registration={register("background")}
          />
        </div>

        <label className="block">
          <span className="text-xs font-semibold text-zinc-600">生成数量</span>
          <input
            className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-[#fbfbf8] px-3 text-sm outline-none transition focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-100"
            inputMode="numeric"
            type="number"
            {...register("count", { valueAsNumber: true })}
          />
          <FieldError message={errors.count?.message} />
        </label>

        <button
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-teal-600 px-4 text-sm font-semibold text-zinc-950 shadow-sm shadow-teal-900/20 transition hover:bg-teal-500 disabled:bg-zinc-300 disabled:text-zinc-600"
          disabled={isGenerating}
          type="submit"
        >
          <Sparkles size={17} aria-hidden="true" />
          {isGenerating ? "生成中..." : "生成素材"}
        </button>

      </form>
    </section>
  );
}

function SelectField({
  label,
  values,
  registration
}: {
  label: string;
  values: Record<string, string>;
  registration: UseFormRegisterReturn;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-zinc-600">{label}</span>
      <select
        className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-[#fbfbf8] px-3 text-sm outline-none transition focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-100"
        {...registration}
      >
        {Object.entries(values).map(([value, labelText]) => (
          <option key={value} value={value}>
            {labelText}
          </option>
        ))}
      </select>
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-1 text-sm text-red-700">{message}</p>;
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
