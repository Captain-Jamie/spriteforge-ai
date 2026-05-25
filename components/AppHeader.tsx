import { Boxes, CircleCheck, Database, WandSparkles } from "lucide-react";

export function AppHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-700 text-white">
            <WandSparkles size={22} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-semibold leading-tight text-zinc-950">SpriteForge AI</h1>
            <p className="mt-1 text-sm text-zinc-600">2D game asset generation workbench</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-2 rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-teal-900">
            <CircleCheck size={16} aria-hidden="true" />
            Mock mode ready
          </span>
          <span className="inline-flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900">
            <Database size={16} aria-hidden="true" />
            Local asset library
          </span>
          <span className="inline-flex items-center gap-2 rounded-md border border-sky-200 bg-sky-50 px-3 py-2 text-sky-900">
            <Boxes size={16} aria-hidden="true" />
            Export pipeline
          </span>
        </div>
      </div>
    </header>
  );
}
