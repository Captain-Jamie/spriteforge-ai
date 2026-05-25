"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import type { GenerateAssetRequest } from "@/lib/asset-schema";
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
  isGenerating?: boolean;
  onSubmit: (request: GenerateAssetRequest) => void;
};

export function AssetForm({ isGenerating = false, onSubmit }: AssetFormProps) {
  const {
    formState: { errors, isSubmitSuccessful },
    handleSubmit,
    register
  } = useForm<GenerateAssetRequest>({
    defaultValues,
    resolver: zodResolver(GenerateAssetRequestSchema)
  });

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-zinc-950">Asset Request</h2>
          <p className="mt-1 text-sm text-zinc-600">Structured controls for game-ready output</p>
        </div>
        <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
          Validated
        </span>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Description</span>
          <textarea
            className="mt-1 min-h-24 w-full resize-none rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            {...register("description")}
          />
          <FieldError message={errors.description?.message} />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <SelectField
            label="Asset type"
            values={ASSET_TYPE_LABELS}
            registration={register("assetType")}
          />
          <SelectField label="Art style" values={ART_STYLE_LABELS} registration={register("style")} />
          <SelectField label="Game genre" values={GAME_GENRE_LABELS} registration={register("gameGenre")} />
          <SelectField label="View" values={VIEW_LABELS} registration={register("view")} />
          <label className="block">
            <span className="text-sm font-medium text-zinc-800">Size</span>
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
            label="Background"
            values={BACKGROUND_LABELS}
            registration={register("background")}
          />
        </div>

        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Count</span>
          <input
            className="mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            inputMode="numeric"
            type="number"
            {...register("count", { valueAsNumber: true })}
          />
          <FieldError message={errors.count?.message} />
        </label>

        <button
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:bg-zinc-300 disabled:text-zinc-600"
          disabled={isGenerating}
          type="submit"
        >
          <Sparkles size={17} aria-hidden="true" />
          {isGenerating ? "Generating..." : "Generate Assets"}
        </button>

        {isSubmitSuccessful ? (
          <p className="rounded-md bg-teal-50 px-3 py-2 text-sm text-teal-900">
            Request validated. Ready for the generation pipeline.
          </p>
        ) : null}
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
      <span className="text-sm font-medium text-zinc-800">{label}</span>
      <select
        className="mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
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
