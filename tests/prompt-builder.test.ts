import { describe, expect, it } from "vitest";
import { GenerateAssetRequestSchema } from "../lib/asset-schema";
import { buildPrompt } from "../lib/prompt-builder";

const baseRequest = {
  description: "Fire slime monster",
  assetType: "character",
  style: "pixel_art",
  gameGenre: "rpg",
  view: "front",
  size: "128x128",
  background: "transparent",
  count: 2
} as const;

describe("GenerateAssetRequestSchema", () => {
  it("accepts a valid request", () => {
    expect(GenerateAssetRequestSchema.safeParse(baseRequest).success).toBe(true);
  });

  it("rejects an empty description", () => {
    const result = GenerateAssetRequestSchema.safeParse({
      ...baseRequest,
      description: ""
    });

    expect(result.success).toBe(false);
  });

  it("rejects count values outside the MVP range", () => {
    const result = GenerateAssetRequestSchema.safeParse({
      ...baseRequest,
      count: 5
    });

    expect(result.success).toBe(false);
  });
});

describe("buildPrompt", () => {
  it("builds a game-ready prompt from a valid request", () => {
    const prompt = buildPrompt(baseRequest);

    expect(prompt.positivePrompt).toContain("像素风");
    expect(prompt.positivePrompt).toContain("pixel art");
    expect(prompt.positivePrompt).toContain("2D 游戏角色素材");
    expect(prompt.positivePrompt).toContain("Fire slime monster");
    expect(prompt.positivePrompt).toContain("正面视角");
    expect(prompt.positivePrompt).toContain("透明背景");
    expect(prompt.negativePrompt).toContain("文字");
    expect(prompt.negativePrompt).toContain("水印");
    expect(prompt.negativePrompt).toContain("模糊");
  });

  it("uses different template content for different asset types", () => {
    const characterPrompt = buildPrompt({
      ...baseRequest,
      assetType: "character"
    }).positivePrompt;
    const itemPrompt = buildPrompt({
      ...baseRequest,
      assetType: "item"
    }).positivePrompt;
    const tilePrompt = buildPrompt({
      ...baseRequest,
      assetType: "tile"
    }).positivePrompt;

    expect(characterPrompt).toContain("完整身体");
    expect(itemPrompt).toContain("适合背包或掉落物");
    expect(tilePrompt).toContain("tilemap 工作流");
    expect(new Set([characterPrompt, itemPrompt, tilePrompt]).size).toBe(3);
  });

  it("injects style profile fields into positive and negative prompts", () => {
    const prompt = buildPrompt({
      ...baseRequest,
      styleProfile: {
        projectName: "Crystal Dungeon",
        palette: "cyan, violet, deep navy",
        lineStyle: "thin bright outline",
        lighting: "soft rim light",
        viewRule: "strict front-facing sprites",
        avoidElements: "modern weapons"
      }
    });

    expect(prompt.positivePrompt).toContain("项目风格参考：Crystal Dungeon");
    expect(prompt.positivePrompt).toContain("配色方案：cyan, violet, deep navy");
    expect(prompt.positivePrompt).toContain("线条风格：thin bright outline");
    expect(prompt.positivePrompt).toContain("项目视角规则：strict front-facing sprites");
    expect(prompt.negativePrompt).toContain("modern weapons");
    expect(prompt.appliedStyleProfile).toContain("避免元素：modern weapons");
    expect(prompt.appliedStyleProfile.length).toBeGreaterThan(0);
  });
});
