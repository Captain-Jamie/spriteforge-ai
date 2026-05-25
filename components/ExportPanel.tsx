import { Archive, FileJson, FolderDown } from "lucide-react";

export function ExportPanel() {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <FolderDown size={18} className="text-sky-700" aria-hidden="true" />
          <div>
            <h2 className="text-base font-semibold text-zinc-950">Export Package</h2>
            <p className="mt-1 text-sm text-zinc-600">PNG assets with metadata and prompts</p>
          </div>
        </div>
        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-800">
          <Archive size={17} aria-hidden="true" />
          Export ZIP
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
        <pre className="overflow-auto rounded-md border border-zinc-200 bg-zinc-950 p-4 text-sm leading-6 text-zinc-100">
{`spriteforge-export/
  assets/
    character_fire_slime_128.png
    item_magic_potion_128.png
  metadata.json
  prompts.json`}
        </pre>
        <div className="grid content-start gap-2">
          <ExportItem label="metadata.json" />
          <ExportItem label="prompts.json" />
          <ExportItem label="assets/*.png" />
        </div>
      </div>
    </section>
  );
}

function ExportItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
      <FileJson size={16} className="text-sky-700" aria-hidden="true" />
      {label}
    </div>
  );
}
