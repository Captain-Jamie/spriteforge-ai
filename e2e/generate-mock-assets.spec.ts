import { expect, test } from "@playwright/test";

test("generates mock assets and prompt from the request form", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();

  await expect(page.getByRole("heading", { name: "SpriteForge AI" })).toBeVisible();
  await expect(page.getByText("Submit a valid asset request")).toBeVisible();

  await page.getByLabel("Project").fill("Crystal Dungeon");
  await page.getByLabel("Palette").fill("cyan, violet, deep navy");
  await page.getByLabel("Line style").fill("thin bright outline");
  await page.getByLabel("Lighting").fill("soft rim light");
  await page.getByLabel("View rule").fill("strict front-facing sprites");
  await page.getByLabel("Avoid").fill("modern weapons");

  await page.getByRole("button", { name: "Generate Assets" }).click();

  await expect(page.getByText("Mock mode")).toBeVisible();
  await expect(page.getByText("pixel art style")).toBeVisible();
  await expect(page.getByText("Applied Style Profile")).toBeVisible();
  await expect(page.locator("li").filter({ hasText: "project style reference: Crystal Dungeon" })).toBeVisible();
  await expect(page.locator("li").filter({ hasText: "color palette: cyan, violet, deep navy" })).toBeVisible();
  await expect(page.locator("li").filter({ hasText: "avoid: modern weapons" })).toBeVisible();
  await expect(page.getByText("text, watermark")).toBeVisible();
  await expect(page.getByText("fire_slime_monster_1")).toBeVisible();
  await expect(page.getByText("fire_slime_monster_2")).toBeVisible();

  await page.reload();

  await expect(page.getByLabel("Project")).toHaveValue("Crystal Dungeon");
  await expect(page.getByLabel("Palette")).toHaveValue("cyan, violet, deep navy");
  await expect(page.getByText("fire_slime_monster_1")).toBeVisible();
  await expect(page.getByText("fire_slime_monster_2")).toBeVisible();

  const firstCard = page.locator("article").filter({ hasText: "fire_slime_monster_1" });
  await firstCard.getByRole("button", { name: "Select asset" }).click();
  await page.getByRole("button", { name: "Selected (1)" }).click();

  await expect(page.getByText("fire_slime_monster_1")).toBeVisible();
  await expect(page.getByText("fire_slime_monster_2")).not.toBeVisible();

  await firstCard.getByRole("button", { name: "Delete" }).click();

  await expect(page.getByText("Selected assets will appear here")).toBeVisible();

  await page.getByRole("button", { name: "All" }).click();

  await expect(page.getByText("fire_slime_monster_1")).not.toBeVisible();
  await expect(page.getByText("fire_slime_monster_2")).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export ZIP" }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe("spriteforge-export.zip");
});
