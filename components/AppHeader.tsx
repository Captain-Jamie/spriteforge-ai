import { Archive, Brush, Grid3X3, Library, WandSparkles } from "lucide-react";

export function AppHeader() {
  return (
    <header className="border-b border-zinc-800 bg-[#101214] text-white shadow-sm shadow-zinc-950/30">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 px-3 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-teal-300/40 bg-teal-400 text-zinc-950 shadow-sm shadow-teal-950/40">
            <WandSparkles size={22} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">SpriteForge AI</h1>
            <p className="mt-0.5 text-xs text-zinc-400">2D 游戏素材生成工作台</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-zinc-200">
            <Grid3X3 size={16} aria-hidden="true" />
            创作台
          </span>
          <span className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900/70 px-3 text-zinc-300">
            <Brush size={16} aria-hidden="true" />
            风格档案
          </span>
          <span className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900/70 px-3 text-zinc-300">
            <Library size={16} aria-hidden="true" />
            素材库
          </span>
          <span className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900/70 px-3 text-zinc-300">
            <Archive size={16} aria-hidden="true" />
            交付导出
          </span>
        </div>
      </div>
    </header>
  );
}
