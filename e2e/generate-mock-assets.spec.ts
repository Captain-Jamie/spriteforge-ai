import { expect, test } from "@playwright/test";

test("generates mock assets and prompt from the request form", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();

  await expect(page.getByRole("heading", { name: "SpriteForge AI" })).toBeVisible();
  await expect(page.getByText("Submit a valid asset request")).toBeVisible();

  await page.getByRole("button", { name: "Generate Assets" }).click();

  await expect(page.getByText("Mock mode")).toBeVisible();
  await expect(page.getByText("pixel art style")).toBeVisible();
  await expect(page.getByText("text, watermark")).toBeVisible();
  await expect(page.getByText("fire_slime_monster_1")).toBeVisible();
  await expect(page.getByText("fire_slime_monster_2")).toBeVisible();

  await page.reload();

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
