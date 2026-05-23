import { expect, test } from "@playwright/test";

test("generates mock assets and prompt from the request form", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();

  await expect(page.getByRole("heading", { name: "SpriteForge AI" })).toBeVisible();
  await expect(page.getByText("提交素材需求后")).toBeVisible();

  await page.getByLabel("项目名称").fill("Crystal Dungeon");
  await page.getByLabel("配色方案").fill("cyan, violet, deep navy");
  await page.getByLabel("线条风格").fill("thin bright outline");
  await page.getByLabel("光照规则").fill("soft rim light");
  await page.getByLabel("视角规则").fill("strict front-facing sprites");
  await page.getByLabel("避免元素").fill("modern weapons");

  await page.getByRole("button", { name: "生成素材" }).click();

  await expect(page.getByText("pixel art style")).toBeVisible();
  await expect(page.getByText("已应用风格档案")).toBeVisible();
  await expect(page.locator("li").filter({ hasText: "project style reference: Crystal Dungeon" })).toBeVisible();
  await expect(page.locator("li").filter({ hasText: "color palette: cyan, violet, deep navy" })).toBeVisible();
  await expect(page.locator("li").filter({ hasText: "avoid: modern weapons" })).toBeVisible();
  await expect(page.getByText("text, watermark")).toBeVisible();
  await expect(page.getByText("fire_slime_monster_1")).toBeVisible();
  await expect(page.getByText("fire_slime_monster_2")).toBeVisible();

  await page.reload();

  await expect(page.getByLabel("项目名称")).toHaveValue("Crystal Dungeon");
  await expect(page.getByLabel("配色方案")).toHaveValue("cyan, violet, deep navy");
  await expect(page.getByText("fire_slime_monster_1")).toBeVisible();
  await expect(page.getByText("fire_slime_monster_2")).toBeVisible();

  const firstCard = page.locator("article").filter({ hasText: "fire_slime_monster_1" });
  await firstCard.getByRole("button", { name: "选择素材" }).click();
  await page.getByRole("button", { name: "已选 (1)" }).click();

  await expect(page.getByText("fire_slime_monster_1")).toBeVisible();
  await expect(page.getByText("fire_slime_monster_2")).not.toBeVisible();

  await firstCard.getByRole("button", { name: "删除" }).click();

  await expect(page.getByText("选择素材后")).toBeVisible();

  await page.getByRole("button", { name: "全部" }).click();

  await expect(page.getByText("fire_slime_monster_1")).not.toBeVisible();
  await expect(page.getByText("fire_slime_monster_2")).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "导出 ZIP" }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe("spriteforge-export.zip");
});
