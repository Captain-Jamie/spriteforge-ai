import { Braces, ImageIcon } from "lucide-react";
import type { GenerateApiResponse, PromptBuildResult } from "@/lib/asset-schema";

type PromptPreviewProps = {
  error?: string | null;
  isGenerating?: boolean;
  mode?: GenerateApiResponse["mode"] | null;
  prompt?: PromptBuildResult | null;
};

export function PromptPreview({ error, isGenerating = false, mode, prompt }: PromptPreviewProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-200/70">
      <div className="mb-4 flex items-center gap-2">
        <Braces size={18} className="text-teal-700" aria-hidden="true" />
        <div>
          <h2 className="text-base font-semibold text-zinc-950">生成工作区</h2>
          <p className="mt-1 text-sm text-zinc-600">查看实际使用的 Prompt 和生成状态</p>
        </div>
      </div>
      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">
          <div className="mb-1 font-semibold text-red-900">生成失败</div>
          <p>{error}</p>
        </div>
      ) : null}
      {isGenerating ? (
        <div className="rounded-md border border-teal-200 bg-teal-50 p-5 text-sm leading-6 text-teal-900">
          正在生成素材并整理 Prompt...
        </div>
      ) : null}
      {prompt && !isGenerating ? (
        <div className="space-y-3">
          <PromptBlock label="正向 Prompt" text={prompt.positivePrompt} />
          <PromptBlock label="反向 Prompt" text={prompt.negativePrompt} />
          {prompt.appliedStyleProfile.length > 0 ? (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-900">
                已应用风格档案
              </div>
              <ul className="space-y-1 text-sm leading-6 text-amber-950">
                {prompt.appliedStyleProfile.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
      {!prompt && !error && !isGenerating ? (
        <div className="grid min-h-[420px] place-items-center rounded-md border border-dashed border-zinc-300 bg-[linear-gradient(45deg,#f4f4f5_25%,transparent_25%),linear-gradient(-45deg,#f4f4f5_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f4f4f5_75%),linear-gradient(-45deg,transparent_75%,#f4f4f5_75%)] bg-[length:24px_24px] bg-[position:0_0,0_12px,12px_-12px,-12px_0px] p-6 text-center text-sm leading-6 text-zinc-600">
          <div>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-500 shadow-sm">
              <ImageIcon size={24} aria-hidden="true" />
            </div>
            <div className="font-semibold text-zinc-900">等待生成结果</div>
            <p className="mt-2 max-w-sm">
              提交素材需求后，这里会展示生成时使用的 Prompt 和项目风格规则。
            </p>
          </div>
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
