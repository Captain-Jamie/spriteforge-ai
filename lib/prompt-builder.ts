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
    styleProfile.projectName && `项目风格参考：${styleProfile.projectName}`,
    styleProfile.palette && `配色方案：${styleProfile.palette}`,
    styleProfile.lineStyle && `线条风格：${styleProfile.lineStyle}`,
    styleProfile.lighting && `光照规则：${styleProfile.lighting}`,
    styleProfile.viewRule && `项目视角规则：${styleProfile.viewRule}`
  ]);

  const negativeParts = compactParts([styleProfile.avoidElements]);

  return {
    positiveParts,
    negativeParts,
    appliedStyleProfile: [...positiveParts, ...negativeParts.map((part) => `避免元素：${part}`)]
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
    `目标尺寸 ${request.size}`,
    "清晰轮廓，clean outline",
    "游戏可用素材，game-ready asset",
    "统一视觉语言，consistent visual language",
    ...styleProfileParts.positiveParts
  ]);

  const negativeParts = compactParts([
    ...BASE_NEGATIVE_PROMPT_PARTS,
    request.background !== "scene" && "杂乱场景背景",
    ...styleProfileParts.negativeParts
  ]);

  return {
    positivePrompt: joinPrompt(positiveParts),
    negativePrompt: joinPrompt(negativeParts),
    appliedStyleProfile: styleProfileParts.appliedStyleProfile
  };
}
