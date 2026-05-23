# SpriteForge AI

面向独立游戏开发者的 2D 游戏素材生成工作台。

当前项目处于持续开发阶段，已实现素材请求表单、Prompt Builder、素材库持久化、ZIP 导出，以及可配置的图像生成服务。

## 功能目标

- 将用户输入的素材需求转换为结构化生成请求。
- 根据素材类型、游戏类型、风格、视角和背景要求生成游戏素材 Prompt。
- 支持默认 Mock 开发模式，便于本地开发和自动化测试。
- 支持通过环境变量切换到真实图像生成 API。
- 支持本地素材库、metadata 导出和 ZIP 素材包。

## 第三方依赖

- Next.js / React：Web 应用框架与 UI 渲染。
- TypeScript：类型约束与工程可维护性。
- Tailwind CSS：页面样式。
- zod：请求数据结构校验。
- react-hook-form / @hookform/resolvers：后续表单状态与校验集成。
- JSZip：后续素材包导出。
- lucide-react：后续界面图标。
- Vitest：单元测试。
- Playwright：端到端交互测试。

## 原创功能说明

本项目的原创实现重点包括：

- 面向 2D 游戏素材生成场景的数据结构设计。
- 根据素材类型、风格、游戏类型、视角、背景和项目风格档案生成 Prompt 的 Prompt Builder。
- 生成请求到 Prompt 的结构化转换链路。
- Mock 开发模式与真实 API 模式共用的生成服务封装。
- 素材管理、选择、删除、Prompt 复制、单图下载与 ZIP 导出链路。

## 运行方式

```bash
npm install
npm run dev
npm run test
npm run test:e2e
```

## 环境变量

复制 `.env.example` 为 `.env.local` 后按需配置。

```bash
MOCK_IMAGE_GENERATION=true
DASHSCOPE_API_KEY=
IMAGE_MODEL=
DASHSCOPE_IMAGE_ENDPOINT=https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation
DASHSCOPE_TASK_ENDPOINT=https://dashscope.aliyuncs.com/api/v1/tasks
DASHSCOPE_TASK_POLL_ATTEMPTS=20
DASHSCOPE_TASK_POLL_INTERVAL_MS=3000
```

默认 `MOCK_IMAGE_GENERATION=true`，用于开发和自动化测试。

如需正式演示真实生成结果，需要先在阿里云百炼或兼容平台申请 API Key，并配置：

```bash
MOCK_IMAGE_GENERATION=false
DASHSCOPE_API_KEY=your_api_key
IMAGE_MODEL=your_image_model
```

真实模式下不会使用 Mock 数据兜底；如果 API Key、模型或供应商接口异常，页面会直接显示错误信息。
如果供应商返回异步任务，服务端会轮询任务结果，直到成功、失败或超时。
