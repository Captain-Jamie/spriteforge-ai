# SpriteForge AI

面向独立游戏开发者的 2D 游戏素材生成工作台。

当前项目的说明视频：https://www.bilibili.com/video/BV1GGGo6yEGq/?spm_id_from=333.1387.homepage.video_card.click&vd_source=eedbe76ac072925710c00d491d5a12c8

## 功能目标

- 将用户输入的素材需求转换为结构化生成请求。
- 根据素材类型、游戏类型、风格、视角和背景要求生成游戏素材 Prompt。
- 后续支持 Mock 生成、素材库、metadata 导出、ZIP 素材包和 Sprite Sheet。

## 第三方依赖

- Next.js / React：Web 应用框架与 UI 渲染。
- TypeScript：类型约束与工程可维护性。
- Tailwind CSS：页面样式。
- zod：请求数据结构校验。
- react-hook-form / @hookform/resolvers：后续表单状态与校验集成。
- JSZip：后续素材包导出。
- lucide-react：后续界面图标。
- Vitest：单元测试。

## 原创功能说明

本项目的原创实现重点包括：

- 面向 2D 游戏素材生成场景的数据结构设计。
- 根据素材类型、风格、游戏类型、视角、背景和项目风格档案生成 Prompt 的 Prompt Builder。
- 后续将实现素材管理、导出包结构、Mock 生成链路和 Sprite Sheet 拼接。

## 运行方式

```bash
npm install
npm run dev
npm run test
```

## 环境变量

复制 `.env.example` 为 `.env.local` 后按需配置。

```bash
MOCK_IMAGE_GENERATION=true
DASHSCOPE_API_KEY=
IMAGE_MODEL=
```
