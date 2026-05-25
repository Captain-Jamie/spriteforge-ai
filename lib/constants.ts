export const ASSET_TYPES = [
  "character",
  "item",
  "icon",
  "tile",
  "ui",
  "background"
] as const;

export const ART_STYLES = [
  "pixel_art",
  "cartoon",
  "hand_drawn",
  "dark_fantasy",
  "chibi"
] as const;

export const GAME_GENRES = [
  "rpg",
  "platformer",
  "tower_defense",
  "roguelike",
  "puzzle"
] as const;

export const ASSET_VIEWS = ["front", "side", "top_down", "isometric"] as const;

export const ASSET_SIZES = ["64x64", "128x128", "256x256", "512x512"] as const;

export const BACKGROUND_MODES = ["transparent", "solid", "scene"] as const;

export const ASSET_TYPE_LABELS: Record<(typeof ASSET_TYPES)[number], string> = {
  character: "角色",
  item: "道具",
  icon: "图标",
  tile: "地块",
  ui: "界面元素",
  background: "背景"
};

export const ART_STYLE_LABELS: Record<(typeof ART_STYLES)[number], string> = {
  pixel_art: "像素风",
  cartoon: "卡通",
  hand_drawn: "手绘",
  dark_fantasy: "暗黑幻想",
  chibi: "Q 版"
};

export const GAME_GENRE_LABELS: Record<(typeof GAME_GENRES)[number], string> = {
  rpg: "RPG",
  platformer: "平台跳跃",
  tower_defense: "塔防",
  roguelike: "Roguelike",
  puzzle: "解谜"
};

export const VIEW_LABELS: Record<(typeof ASSET_VIEWS)[number], string> = {
  front: "正面",
  side: "侧面",
  top_down: "俯视",
  isometric: "等距"
};

export const BACKGROUND_LABELS: Record<(typeof BACKGROUND_MODES)[number], string> = {
  transparent: "透明背景",
  solid: "纯色背景",
  scene: "场景背景"
};

export const ASSET_TYPE_PROMPT_PARTS: Record<(typeof ASSET_TYPES)[number], string> = {
  character:
    "2D 游戏角色素材，完整身体，居中构图，清晰剪影，小尺寸可读，game character sprite",
  item:
    "2D 游戏道具素材，独立物体，居中构图，轮廓明确，适合背包或掉落物，inventory item",
  icon:
    "2D 游戏图标，符号清晰，居中构图，边缘干净，适合 UI 或背包栏，game icon",
  tile:
    "2D 地形地块素材，可平铺纹理，顶部表面清晰，适合 tilemap 工作流，seamless tile",
  ui:
    "2D 游戏界面元素，形状清晰，适合 HUD 或菜单，game UI asset",
  background:
    "2D 游戏背景素材，场景层次清楚，空间深度明确，适合游戏环境，game background"
};

export const ART_STYLE_PROMPT_PARTS: Record<(typeof ART_STYLES)[number], string> = {
  pixel_art:
    "像素风，pixel art，清晰像素，有限色板，无抗锯齿，game sprite aesthetic",
  cartoon:
    "卡通风格，cartoon style，粗轮廓，明亮配色，简洁明暗，playful game-ready look",
  hand_drawn:
    "手绘风格，hand drawn style，自然线条，柔和质感，illustrated game asset look",
  dark_fantasy:
    "暗黑幻想风格，dark fantasy，强烈明暗对比，低饱和配色，精致细节，moody game asset",
  chibi:
    "Q 版风格，chibi style，可爱比例，圆润形体，表情明确，compact game asset"
};

export const GAME_GENRE_PROMPT_PARTS: Record<(typeof GAME_GENRES)[number], string> = {
  rpg: "适合 2D RPG 游戏，作为 RPG 素材易识别",
  platformer: "适合 2D 平台跳跃游戏，侧向移动场景中易读",
  tower_defense: "适合塔防游戏，从策略视角观察时轮廓清楚",
  roguelike: "适合 Roguelike 游戏，紧凑且可重复使用的素材设计",
  puzzle: "适合解谜游戏，视觉语言简洁易读"
};

export const VIEW_PROMPT_PARTS: Record<(typeof ASSET_VIEWS)[number], string> = {
  front: "正面视角，front view，对称展示",
  side: "侧面视角，side view，适合横版玩法",
  top_down: "俯视视角，top-down view，从上方观察仍清晰",
  isometric: "等距视角，isometric view，保持统一 2D 游戏透视"
};

export const BACKGROUND_PROMPT_PARTS: Record<(typeof BACKGROUND_MODES)[number], string> = {
  transparent: "透明背景，transparent background，独立素材，无场景背景",
  solid: "纯色背景，plain solid color background，便于抠图",
  scene: "简洁游戏场景背景，simple game scene background，构图不拥挤"
};

export const BASE_NEGATIVE_PROMPT_PARTS = [
  "文字",
  "水印",
  "logo",
  "签名",
  "模糊",
  "低分辨率",
  "真实照片质感",
  "复杂背景",
  "主体被裁切",
  "风格不一致",
  "多余肢体",
  "重复物体"
];
