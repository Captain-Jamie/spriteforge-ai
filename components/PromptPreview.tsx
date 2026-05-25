import { Braces } from "lucide-react";
import type { GenerateAssetRequest } from "@/lib/asset-schema";

type PromptPreviewProps = {
  request?: GenerateAssetRequest | null;
};

export function PromptPreview({ request }: PromptPreviewProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Braces size={18} className="text-teal-700" aria-hidden="true" />
        <h2 className="text-base font-semibold text-zinc-950">Prompt Preview</h2>
      </div>
      {request ? (
        <div className="space-y-3">
          <PromptBlock label="Structured Request" text={JSON.stringify(request, null, 2)} />
          <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Prompt generation will be connected in the next version.
          </p>
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm leading-6 text-zinc-600">
          Submit a valid asset request to preview the structured payload for the generation
          pipeline.
        </div>
      )}
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
