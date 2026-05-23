import type { AssetType, GeneratedImage } from "./asset-schema";

const MOCK_COLORS: Record<AssetType, { accent: string; fill: string; label: string }> = {
  character: {
    accent: "#0f766e",
    fill: "#ccfbf1",
    label: "CHAR"
  },
  item: {
    accent: "#b45309",
    fill: "#fef3c7",
    label: "ITEM"
  },
  icon: {
    accent: "#0369a1",
    fill: "#e0f2fe",
    label: "ICON"
  },
  tile: {
    accent: "#15803d",
    fill: "#dcfce7",
    label: "TILE"
  },
  ui: {
    accent: "#7c3aed",
    fill: "#ede9fe",
    label: "UI"
  },
  background: {
    accent: "#334155",
    fill: "#e2e8f0",
    label: "BG"
  }
};

export function createMockImages(assetType: AssetType, count: number): GeneratedImage[] {
  return Array.from({ length: count }, (_, index) => ({
    url: createMockSvgDataUrl(assetType, index),
    seed: `${assetType}-${index + 1}`
  }));
}

function createMockSvgDataUrl(assetType: AssetType, index: number) {
  const palette = MOCK_COLORS[assetType];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="36" fill="${palette.fill}"/>
  <rect x="74" y="74" width="364" height="364" rx="28" fill="#ffffff" stroke="${palette.accent}" stroke-width="18"/>
  <circle cx="256" cy="218" r="76" fill="${palette.fill}" stroke="${palette.accent}" stroke-width="16"/>
  <path d="M154 354c56-62 148-62 204 0" fill="none" stroke="${palette.accent}" stroke-width="22" stroke-linecap="round"/>
  <text x="256" y="454" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="${palette.accent}">${palette.label} ${index + 1}</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
