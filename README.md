# SpriteForge AI

SpriteForge AI 是一个面向独立游戏开发者和小型游戏团队的 2D 游戏素材生成工作台。

项目将用户输入的素材需求转换为结构化 Prompt，调用真实文生图 API 生成素材，并提供素材库管理、风格档案、Prompt 预览和 ZIP 素材包导出能力。

## 核心功能

- 素材需求表单：支持素材类型、风格、游戏类型、视角、尺寸、背景和生成数量。
- 项目风格档案：支持项目名、配色、线条风格、光照、视角规则和避免元素。
- Prompt Builder：根据素材需求和风格档案生成中文为主、中英混合关键词辅助的 positive prompt 与 negative prompt。
- 真实 API 生图：支持通过阿里云百炼 DashScope 图像生成接口返回真实素材。
- 本地素材库：支持生成结果持久化、选择、删除、复制 Prompt 和单图下载。
- ZIP 导出：导出 `assets/`、`metadata.json` 和 `prompts.json`，真实 API 返回的远程图片会在服务端下载后写入 ZIP。
- Mock 测试模式：仅在显式开启时用于本地自动化测试，避免消耗真实 API 额度。

## 原创功能说明

本项目的原创实现包括：

- 面向 2D 游戏素材生成场景的数据结构设计。
- 将游戏素材需求转换为适合国内文生图模型理解的 Prompt Builder。
- 用于保持项目视觉一致性的 Style Profile 工作流。
- 真实 API 与测试 Mock 共用的生成服务封装。
- 素材库管理、导出 metadata、导出 prompts 和 ZIP 打包流程。
- 面向游戏开发交付链路设计的整体工作台 UI。

## 第三方依赖

- Next.js / React：Web 应用框架与 UI 渲染。
- TypeScript：类型约束与工程可维护性。
- Tailwind CSS：页面样式。
- zod：请求数据结构校验。
- react-hook-form / @hookform/resolvers：表单状态与校验集成。
- JSZip：ZIP 素材包生成。
- lucide-react：界面图标。
- Vitest：单元测试。
- Playwright：端到端浏览器测试。

## 安装与启动

```bash
npm install
cp .env.example .env.local
npm run dev
```

启动后访问：

```text
http://localhost:3000
```

## 环境变量

正式演示模式默认使用真实 API，当前版本支持接入阿里云百炼 DashScope 图像生成 API：

```env
MOCK_IMAGE_GENERATION=false
DASHSCOPE_API_KEY=
IMAGE_MODEL=
DASHSCOPE_IMAGE_ENDPOINT=https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation
DASHSCOPE_TASK_ENDPOINT=https://dashscope.aliyuncs.com/api/v1/tasks
DASHSCOPE_TASK_POLL_ATTEMPTS=20
DASHSCOPE_TASK_POLL_INTERVAL_MS=3000
```

真实 API 示例配置：

```env
MOCK_IMAGE_GENERATION=false
DASHSCOPE_API_KEY=your_api_key
IMAGE_MODEL=qwen-image-2.0
```

请不要提交 `.env.local` 或任何 API Key。

## 生成模式说明

正式演示应使用 Real API mode，也就是：

```env
MOCK_IMAGE_GENERATION=false
```

该模式会调用配置的图像生成服务，返回真实生成素材。如果 API Key、模型、额度、网络或供应商服务异常，页面会直接显示真实错误，不会回退到 Mock 数据。

Mock mode 仅用于本地自动化测试或开发回归：

```env
MOCK_IMAGE_GENERATION=true
```

正式演示和答辩中不应使用 Mock 数据冒充真实生成结果。

## 常用命令

```bash
npm run dev
npm run test
npm run build
npm run test:e2e
```

如果 `.env.local` 当前是真实 API 模式，为避免端到端测试消耗生图额度，可以临时覆盖：

```powershell
$env:MOCK_IMAGE_GENERATION='true'; npm run test:e2e
```

## 演示流程

1. 填写 Style Profile，设定项目美术规则。
2. 填写 Asset Request，描述需要生成的游戏素材。
3. 点击 Generate Assets 调用真实 API 生成素材。
4. 在 Prompt Preview 中查看实际使用的 Prompt。
5. 在 Asset Library 中选择、删除或下载素材。
6. 点击 Export ZIP 导出素材包。

导出的 ZIP 包包含素材文件、metadata 和 prompts。真实 API 生成的远程图片会被下载并写入 `assets/`，避免导出结果依赖临时图片链接，可用于展示“需求输入 -> Prompt 生成 -> AI 生图 -> 素材管理 -> 交付导出”的完整流程。
