import { Braces } from "lucide-react";
import type { GenerateApiResponse, PromptBuildResult } from "@/lib/asset-schema";

type PromptPreviewProps = {
  error?: string | null;
  isGenerating?: boolean;
  mode?: GenerateApiResponse["mode"] | null;
  prompt?: PromptBuildResult | null;
};

export function PromptPreview({ error, isGenerating = false, mode, prompt }: PromptPreviewProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Braces size={18} className="text-teal-700" aria-hidden="true" />
        <h2 className="text-base font-semibold text-zinc-950">Prompt Preview</h2>
      </div>
      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">
          {error}
        </div>
      ) : null}
      {isGenerating ? (
        <div className="rounded-md border border-teal-200 bg-teal-50 p-4 text-sm leading-6 text-teal-900">
          Generating mock assets and enhanced prompt...
        </div>
      ) : null}
      {prompt && !isGenerating ? (
        <div className="space-y-3">
          <div className="inline-flex rounded-md border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-teal-900">
            {mode === "mock" ? "Mock mode" : "Real mode"}
          </div>
          <PromptBlock label="Positive" text={prompt.positivePrompt} />
          <PromptBlock label="Negative" text={prompt.negativePrompt} />
          <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Assets are temporary in this version. Library persistence will be added later.
          </p>
        </div>
      ) : null}
      {!prompt && !error && !isGenerating ? (
        <div className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm leading-6 text-zinc-600">
          Submit a valid asset request to preview the generated prompt and mock assets.
        </div>
      ) : null}
    </section>
  );
}

function PromptBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</div>
      <p className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm leading-6 text-zinc-700">
        {text}
      </p>
    </div>
  );
}
