import { expect, test } from "@playwright/test";

test("generates mock assets and prompt from the request form", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    window.localStorage.clear();
    window.indexedDB.deleteDatabase("spriteforge.asset-cache.v1");
  });
  await page.reload();

  await expect(page.getByRole("heading", { name: "SpriteForge AI" })).toBeVisible();
  await expect(page.getByText("生成或点击素材后")).toBeVisible();

  await page.getByRole("button", { name: /项目风格约束/ }).click();
  await page.getByLabel("项目名称").fill("Crystal Dungeon");
  await page.getByLabel("配色方案").fill("cyan, violet, deep navy");
  await page.getByLabel("线条风格").fill("thin bright outline");
  await page.getByLabel("光照规则").fill("soft rim light");
  await page.getByLabel("视角规则").fill("strict front-facing sprites");
  await page.getByLabel("避免元素").fill("modern weapons");

  await page.getByRole("button", { name: "生成素材" }).click();

  await expect(page.getByRole("heading", { name: "素材详情" })).toBeVisible();
  await expect(
    page
      .locator("section")
      .filter({ hasText: "素材详情" })
      .getByText("角色")
      .first()
  ).toBeVisible();
  await page.getByRole("button", { name: "查看Prompt" }).click();
  const promptWorkspace = page
    .getByRole("heading", { name: "Prompt 详情" })
    .locator("xpath=ancestor::section[1]");
  await expect(promptWorkspace.getByText("像素风")).toBeVisible();
  await expect(promptWorkspace.getByText("pixel art")).toBeVisible();
  await expect(promptWorkspace.getByText("已应用风格档案")).toBeVisible();
  await expect(promptWorkspace.locator("li").filter({ hasText: "项目风格参考：Crystal Dungeon" })).toBeVisible();
  await expect(promptWorkspace.locator("li").filter({ hasText: "配色方案：cyan, violet, deep navy" })).toBeVisible();
  await expect(promptWorkspace.locator("li").filter({ hasText: "避免元素：modern weapons" })).toBeVisible();
  await expect(promptWorkspace.locator("div").filter({ hasText: "反向 Prompt" }).getByText("文字")).toBeVisible();
  await expect(promptWorkspace.locator("div").filter({ hasText: "反向 Prompt" }).getByText("水印")).toBeVisible();
  await page.getByRole("button", { name: "关闭 Prompt 详情" }).click();
  await expect(
    page.locator("section").filter({ hasText: "素材详情" }).locator('img[alt*="fire_slime_monster_1"]').first()
  ).toBeVisible();
  await expect(page.locator("article").filter({ hasText: "fire_slime_monster_1" })).toBeVisible();
  await expect(page.locator("article").filter({ hasText: "fire_slime_monster_2" })).toBeVisible();

  await page.reload();

  await page.getByRole("button", { name: /项目风格约束/ }).click();
  await expect(page.getByLabel("项目名称")).toHaveValue("Crystal Dungeon");
  await expect(page.getByLabel("配色方案")).toHaveValue("cyan, violet, deep navy");
  await expect(page.locator("article").filter({ hasText: "fire_slime_monster_1" })).toBeVisible();
  await expect(page.locator("article").filter({ hasText: "fire_slime_monster_2" })).toBeVisible();

  await page.locator("article").filter({ hasText: "fire_slime_monster_1" }).getByRole("button", { name: "选择素材" }).click();
  await page.locator("article").filter({ hasText: "fire_slime_monster_2" }).getByRole("button", { name: "选择素材" }).click();
  const spriteSheetDownloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "导出 Sprite Sheet" }).click();
  const spriteSheetDownload = await spriteSheetDownloadPromise;
  expect(spriteSheetDownload.suggestedFilename()).toBe("spriteforge-spritesheet.zip");
  await page.locator("article").filter({ hasText: "fire_slime_monster_1" }).getByRole("button", { name: "选择素材" }).click();
  await page.locator("article").filter({ hasText: "fire_slime_monster_2" }).getByRole("button", { name: "选择素材" }).click();

  await page.getByLabel("搜索素材").fill("monster_2");
  await expect(page.locator("article").filter({ hasText: "fire_slime_monster_1" })).not.toBeVisible();
  await expect(page.locator("article").filter({ hasText: "fire_slime_monster_2" })).toBeVisible();
  await page.getByRole("button", { name: "清除搜索" }).click();

  await page.getByRole("button", { name: "图标 0" }).click();
  await expect(page.getByText("没有符合当前搜索或类型筛选条件的素材")).toBeVisible();
  await page.getByRole("button", { name: "角色 2" }).click();
  await expect(page.locator("article").filter({ hasText: "fire_slime_monster_1" })).toBeVisible();
  await expect(page.locator("article").filter({ hasText: "fire_slime_monster_2" })).toBeVisible();
  await page.getByRole("button", { name: "全选当前展示素材" }).click();
  await expect(page.getByRole("button", { name: "已选 (2)" })).toBeVisible();
  await page.getByRole("button", { name: "全选当前展示素材" }).click();
  await expect(page.getByRole("button", { name: "已选 (0)" })).toBeVisible();

  await page.locator("article").filter({ hasText: "fire_slime_monster_2" }).getByRole("button").first().click();
  await expect(
    page.locator("section").filter({ hasText: "素材详情" }).locator('img[alt*="fire_slime_monster_2"]').first()
  ).toBeVisible();

  const firstCard = page.locator("article").filter({ hasText: "fire_slime_monster_1" });
  await firstCard.getByRole("button", { name: "选择素材" }).click();
  await page.getByRole("button", { name: "已选 (1)" }).click();

  await expect(page.locator("article").filter({ hasText: "fire_slime_monster_1" })).toBeVisible();
  await expect(page.locator("article").filter({ hasText: "fire_slime_monster_2" })).not.toBeVisible();

  await firstCard.getByRole("button", { name: "删除" }).click();
  await expect(page.getByRole("heading", { name: "确认删除素材" })).toBeVisible();
  await page.getByRole("button", { name: "确认删除" }).click();

  await expect(page.getByText("选择素材后")).toBeVisible();

  await page.getByRole("button", { name: /^全部 \(\d+\)$/ }).click();

  await expect(page.locator("article").filter({ hasText: "fire_slime_monster_1" })).not.toBeVisible();
  await expect(page.locator("article").filter({ hasText: "fire_slime_monster_2" })).toBeVisible();

  await page.getByRole("button", { exact: true, name: "导出" }).click();
  await expect(page.getByRole("heading", { name: "确认导出素材包" })).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "确认导出 ZIP" }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe("spriteforge-export.zip");

  await page.getByRole("button", { name: "全选当前展示素材" }).click();
  await page.getByRole("button", { name: "删除已选素材" }).click();
  await expect(page.getByRole("heading", { name: "确认删除已选素材" })).toBeVisible();
  await page.getByRole("button", { name: "确认删除" }).click();
  await expect(page.getByText("生成素材后，这里会显示可管理和导出的素材卡片。")).toBeVisible();
});
