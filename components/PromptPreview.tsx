"use client";

import { Check, Clipboard, ImageIcon, X } from "lucide-react";
import { useState } from "react";
import type { GenerateApiResponse, PromptBuildResult } from "@/lib/asset-schema";
import { copyToClipboard } from "@/lib/file-utils";

type PromptPreviewProps = {
  error?: string | null;
  isGenerating?: boolean;
  mode?: GenerateApiResponse["mode"] | null;
  onClose?: () => void;
  prompt?: PromptBuildResult | null;
};

export function PromptPreview({ error, isGenerating = false, mode, onClose, prompt }: PromptPreviewProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopyPrompt() {
    if (!prompt) {
      return;
    }

    const text = [
      `正向 Prompt:\n${prompt.positivePrompt}`,
      `反向 Prompt:\n${prompt.negativePrompt}`,
      prompt.appliedStyleProfile.length > 0
        ? `已应用风格档案:\n${prompt.appliedStyleProfile.join("\n")}`
        : ""
    ]
      .filter(Boolean)
      .join("\n\n");

    await copyToClipboard(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section className="overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-xl shadow-zinc-950/25">
      <div className="flex items-start justify-between gap-4 border-b border-zinc-200 bg-[#f7f7f4] px-4 py-3">
        <div>
          <h2 className="text-base font-semibold text-zinc-950">Prompt 详情</h2>
          <p className="mt-0.5 text-xs text-zinc-500">查看本次素材生成使用的正向、反向提示词</p>
        </div>
        <div className="flex items-center gap-2">
          {prompt ? (
            <button
              className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50"
              onClick={handleCopyPrompt}
              type="button"
            >
              <Clipboard size={15} aria-hidden="true" />
              复制
            </button>
          ) : null}
          {onClose ? (
            <button
              aria-label="关闭 Prompt 详情"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-600 shadow-sm hover:bg-zinc-50"
              onClick={onClose}
              type="button"
            >
              <X size={16} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>
      <div className="relative p-4">
        {copied ? (
          <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-medium text-teal-800 shadow-sm">
            <Check size={15} aria-hidden="true" />
            已复制
          </div>
        ) : null}
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
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 shadow-sm shadow-amber-950/5">
              <div className="mb-2 text-xs font-semibold text-amber-900">
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
        <div className="canvas-checker grid min-h-[260px] place-items-center rounded-md border border-dashed border-zinc-300 p-6 text-center text-sm leading-6 text-zinc-600">
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
      </div>
    </section>
  );
}

function PromptBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <div className="mb-1 text-xs font-semibold text-zinc-500">{label}</div>
      <p className="rounded-md border border-zinc-200 bg-[#fbfbf8] p-3 text-sm leading-6 text-zinc-700">
        {text}
      </p>
    </div>
  );
}
