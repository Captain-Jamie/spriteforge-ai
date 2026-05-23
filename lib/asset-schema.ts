import { z } from "zod";
import {
  ART_STYLES,
  ASSET_SIZES,
  ASSET_TYPES,
  ASSET_VIEWS,
  BACKGROUND_MODES,
  GAME_GENRES
} from "./constants";

export const StyleProfileSchema = z.object({
  projectName: z.string().trim().max(80).optional().default(""),
  palette: z.string().trim().max(120).optional().default(""),
  lineStyle: z.string().trim().max(120).optional().default(""),
  lighting: z.string().trim().max(120).optional().default(""),
  viewRule: z.string().trim().max(120).optional().default(""),
  avoidElements: z.string().trim().max(200).optional().default("")
});

export const GenerateAssetRequestSchema = z.object({
  description: z.string().trim().min(2).max(200),
  assetType: z.enum(ASSET_TYPES),
  style: z.enum(ART_STYLES),
  gameGenre: z.enum(GAME_GENRES),
  view: z.enum(ASSET_VIEWS),
  size: z.enum(ASSET_SIZES),
  background: z.enum(BACKGROUND_MODES),
  count: z.number().int().min(1).max(4),
  styleProfile: StyleProfileSchema.optional()
});

export const PromptBuildResultSchema = z.object({
  positivePrompt: z.string().min(1),
  negativePrompt: z.string().min(1),
  appliedStyleProfile: z.array(z.string())
});

export const AssetRecordSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  assetType: z.enum(ASSET_TYPES),
  style: z.enum(ART_STYLES),
  gameGenre: z.enum(GAME_GENRES),
  view: z.enum(ASSET_VIEWS),
  size: z.enum(ASSET_SIZES),
  background: z.enum(BACKGROUND_MODES),
  prompt: z.string().min(1),
  negativePrompt: z.string().min(1),
  imageUrl: z.string().min(1),
  createdAt: z.string().min(1)
});

export const ExportPackageSchema = z.object({
  assets: z.array(AssetRecordSchema),
  styleProfile: StyleProfileSchema.optional(),
  exportedAt: z.string().min(1)
});

export const GeneratedImageSchema = z.object({
  url: z.string().min(1),
  seed: z.string().optional()
});

export const GenerateApiResponseSchema = z.object({
  assets: z.array(AssetRecordSchema),
  prompt: PromptBuildResultSchema,
  mode: z.enum(["mock", "real"])
});

export type StyleProfile = z.infer<typeof StyleProfileSchema>;
export type GenerateAssetRequest = z.infer<typeof GenerateAssetRequestSchema>;
export type PromptBuildResult = z.infer<typeof PromptBuildResultSchema>;
export type AssetRecord = z.infer<typeof AssetRecordSchema>;
export type ExportPackage = z.infer<typeof ExportPackageSchema>;
export type GeneratedImage = z.infer<typeof GeneratedImageSchema>;
export type GenerateApiResponse = z.infer<typeof GenerateApiResponseSchema>;
export type AssetType = GenerateAssetRequest["assetType"];
export type ArtStyle = GenerateAssetRequest["style"];
export type GameGenre = GenerateAssetRequest["gameGenre"];
export type AssetView = GenerateAssetRequest["view"];
export type AssetSize = GenerateAssetRequest["size"];
export type BackgroundMode = GenerateAssetRequest["background"];
