import { expect, test } from "@playwright/test";

test("generates mock assets and prompt from the request form", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "SpriteForge AI" })).toBeVisible();
  await expect(page.getByText("Submit a valid asset request")).toBeVisible();

  await page.getByRole("button", { name: "Generate Assets" }).click();

  await expect(page.getByText("Mock mode")).toBeVisible();
  await expect(page.getByText("pixel art style")).toBeVisible();
  await expect(page.getByText("text, watermark")).toBeVisible();
  await expect(page.getByText("fire_slime_monster_1")).toBeVisible();
  await expect(page.getByText("fire_slime_monster_2")).toBeVisible();
});
