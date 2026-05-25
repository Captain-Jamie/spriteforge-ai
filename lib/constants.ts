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
  character: "Character",
  item: "Item",
  icon: "Icon",
  tile: "Tile",
  ui: "UI Element",
  background: "Background"
};

export const ART_STYLE_LABELS: Record<(typeof ART_STYLES)[number], string> = {
  pixel_art: "Pixel Art",
  cartoon: "Cartoon",
  hand_drawn: "Hand Drawn",
  dark_fantasy: "Dark Fantasy",
  chibi: "Chibi"
};

export const GAME_GENRE_LABELS: Record<(typeof GAME_GENRES)[number], string> = {
  rpg: "RPG",
  platformer: "Platformer",
  tower_defense: "Tower Defense",
  roguelike: "Roguelike",
  puzzle: "Puzzle"
};

export const VIEW_LABELS: Record<(typeof ASSET_VIEWS)[number], string> = {
  front: "Front View",
  side: "Side View",
  top_down: "Top Down",
  isometric: "Isometric"
};

export const ASSET_TYPE_PROMPT_PARTS: Record<(typeof ASSET_TYPES)[number], string> = {
  character:
    "2D game character asset, full body, centered composition, clean silhouette, readable at small size",
  item:
    "2D game item prop, isolated object, centered composition, clear shape, inventory-ready asset",
  icon:
    "2D game icon, simple readable symbol, centered composition, clean edge, suitable for UI inventory",
  tile:
    "2D game terrain tile, seamless tileable pattern, clear top surface, suitable for tilemap workflow",
  ui:
    "2D game UI element, clean interface asset, readable shape, suitable for game HUD or menu",
  background:
    "2D game background asset, layered scene composition, clear depth, suitable for game environment"
};

export const ART_STYLE_PROMPT_PARTS: Record<(typeof ART_STYLES)[number], string> = {
  pixel_art:
    "pixel art style, crisp pixels, limited color palette, no anti-aliasing, game sprite aesthetic",
  cartoon:
    "cartoon style, bold outline, bright colors, simple shading, playful game-ready look",
  hand_drawn:
    "hand drawn style, organic line work, soft texture, illustrated game asset look",
  dark_fantasy:
    "dark fantasy style, dramatic contrast, muted palette, ornate details, moody game asset",
  chibi:
    "chibi style, cute proportions, rounded forms, expressive and compact game asset"
};

export const GAME_GENRE_PROMPT_PARTS: Record<(typeof GAME_GENRES)[number], string> = {
  rpg: "suitable for a 2D RPG game, readable as an RPG asset",
  platformer: "suitable for a 2D platformer game, clear side-scrolling readability",
  tower_defense: "suitable for a tower defense game, readable from strategic gameplay view",
  roguelike: "suitable for a roguelike game, compact and repeatable asset design",
  puzzle: "suitable for a puzzle game, simple readable visual language"
};

export const VIEW_PROMPT_PARTS: Record<(typeof ASSET_VIEWS)[number], string> = {
  front: "front view, symmetrical presentation",
  side: "side view, suitable for side-scrolling gameplay",
  top_down: "top-down view, readable from above",
  isometric: "isometric view, consistent 2D game perspective"
};

export const BACKGROUND_PROMPT_PARTS: Record<(typeof BACKGROUND_MODES)[number], string> = {
  transparent: "transparent background, isolated asset, no scene background",
  solid: "plain solid color background, easy to remove",
  scene: "simple game scene background, uncluttered composition"
};

export const BASE_NEGATIVE_PROMPT_PARTS = [
  "text",
  "watermark",
  "logo",
  "signature",
  "blurry",
  "low resolution",
  "realistic photo",
  "complex background",
  "cropped subject",
  "inconsistent style",
  "extra limbs",
  "duplicate objects"
];
