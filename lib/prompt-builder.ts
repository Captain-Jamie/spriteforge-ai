import type { GenerateAssetRequest, PromptBuildResult, StyleProfile } from "./asset-schema";
import {
  ART_STYLE_PROMPT_PARTS,
  ASSET_TYPE_PROMPT_PARTS,
  BACKGROUND_PROMPT_PARTS,
  BASE_NEGATIVE_PROMPT_PARTS,
  GAME_GENRE_PROMPT_PARTS,
  VIEW_PROMPT_PARTS
} from "./constants";

function compactParts(parts: Array<string | undefined | null | false>) {
  return parts
    .map((part) => (typeof part === "string" ? part.trim() : ""))
    .filter(Boolean);
}

function normalizeDescription(description: string) {
  return description.trim().replace(/\s+/g, " ");
}

function buildStyleProfileParts(styleProfile?: StyleProfile) {
  if (!styleProfile) {
    return {
      positiveParts: [] as string[],
      negativeParts: [] as string[],
      appliedStyleProfile: [] as string[]
    };
  }

  const positiveParts = compactParts([
    styleProfile.projectName && `project style reference: ${styleProfile.projectName}`,
    styleProfile.palette && `color palette: ${styleProfile.palette}`,
    styleProfile.lineStyle && `line style: ${styleProfile.lineStyle}`,
    styleProfile.lighting && `lighting: ${styleProfile.lighting}`,
    styleProfile.viewRule && `project view rule: ${styleProfile.viewRule}`
  ]);

  const negativeParts = compactParts([styleProfile.avoidElements]);

  return {
    positiveParts,
    negativeParts,
    appliedStyleProfile: [...positiveParts, ...negativeParts.map((part) => `avoid: ${part}`)]
  };
}

function joinPrompt(parts: string[]) {
  return Array.from(new Set(parts)).join(", ");
}

export function buildPrompt(request: GenerateAssetRequest): PromptBuildResult {
  const styleProfileParts = buildStyleProfileParts(request.styleProfile);

  const positiveParts = compactParts([
    ART_STYLE_PROMPT_PARTS[request.style],
    ASSET_TYPE_PROMPT_PARTS[request.assetType],
    normalizeDescription(request.description),
    GAME_GENRE_PROMPT_PARTS[request.gameGenre],
    VIEW_PROMPT_PARTS[request.view],
    BACKGROUND_PROMPT_PARTS[request.background],
    `target size ${request.size}`,
    "clean outline",
    "game-ready asset",
    "consistent visual language",
    ...styleProfileParts.positiveParts
  ]);

  const negativeParts = compactParts([
    ...BASE_NEGATIVE_PROMPT_PARTS,
    request.background !== "scene" && "busy scene background",
    ...styleProfileParts.negativeParts
  ]);

  return {
    positivePrompt: joinPrompt(positiveParts),
    negativePrompt: joinPrompt(negativeParts),
    appliedStyleProfile: styleProfileParts.appliedStyleProfile
  };
}
