import { Check, Download, ImageIcon } from "lucide-react";

const toneClasses = {
  teal: "border-teal-200 bg-teal-50 text-teal-800",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  sky: "border-sky-200 bg-sky-50 text-sky-800"
};

type AssetCardProps = {
  name: string;
  type: string;
  style: string;
  size: string;
  tone: keyof typeof toneClasses;
};

export function AssetCard({ name, type, style, size, tone }: AssetCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <div className="flex aspect-square items-center justify-center bg-[linear-gradient(45deg,#f4f4f5_25%,transparent_25%),linear-gradient(-45deg,#f4f4f5_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f4f4f5_75%),linear-gradient(-45deg,transparent_75%,#f4f4f5_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px]">
        <div
          className={`flex h-24 w-24 items-center justify-center rounded-md border ${toneClasses[tone]}`}
        >
          <ImageIcon size={34} aria-hidden="true" />
        </div>
      </div>
      <div className="space-y-3 p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-zinc-950">{name}</h3>
            <p className="mt-1 text-xs text-zinc-500">
              {type} · {style} · {size}
            </p>
          </div>
          <button className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-300 text-zinc-600 hover:bg-zinc-50">
            <Check size={15} aria-hidden="true" />
            <span className="sr-only">Select asset</span>
          </button>
        </div>
        <button className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-zinc-300 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
          <Download size={15} aria-hidden="true" />
          Download PNG
        </button>
      </div>
    </article>
  );
}
