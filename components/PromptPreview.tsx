import { Braces } from "lucide-react";

export function PromptPreview() {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Braces size={18} className="text-teal-700" aria-hidden="true" />
        <h2 className="text-base font-semibold text-zinc-950">Prompt Preview</h2>
      </div>
      <div className="space-y-3">
        <PromptBlock
          label="Positive"
          text="pixel art style, 2D game character asset, Fire slime monster, front view, transparent background, target size 128x128, game-ready asset"
        />
        <PromptBlock
          label="Negative"
          text="text, watermark, logo, blurry, realistic photo, complex background, cropped subject, inconsistent style"
        />
      </div>
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
