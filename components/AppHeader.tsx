import { Archive, Brush, Library, WandSparkles } from "lucide-react";

export function AppHeader() {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950 text-white">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-500 text-zinc-950 shadow-sm shadow-teal-950/40">
            <WandSparkles size={22} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-semibold leading-tight tracking-wide">SpriteForge AI</h1>
            <p className="mt-1 text-sm text-zinc-400">2D 游戏素材生成工作台</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-200">
            <Brush size={16} aria-hidden="true" />
            风格档案
          </span>
          <span className="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-200">
            <Library size={16} aria-hidden="true" />
            素材库
          </span>
          <span className="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-200">
            <Archive size={16} aria-hidden="true" />
            交付导出
          </span>
        </div>
      </div>
    </header>
  );
}
