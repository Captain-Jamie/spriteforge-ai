import type { GenerateAssetRequest, GeneratedImage, PromptBuildResult } from "./asset-schema";
import { createMockImages } from "./mock-assets";

export type ImageGenerationMode = "mock" | "real";

const DEFAULT_DASHSCOPE_IMAGE_ENDPOINT =
  "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
const DEFAULT_DASHSCOPE_TASK_ENDPOINT = "https://dashscope.aliyuncs.com/api/v1/tasks";
const DEFAULT_TASK_POLL_INTERVAL_MS = 3000;
const DEFAULT_TASK_POLL_ATTEMPTS = 20;

type GenerateImagesInput = {
  request: GenerateAssetRequest;
  prompt: PromptBuildResult;
};

export async function generateImages({
  request,
  prompt
}: GenerateImagesInput): Promise<{ images: GeneratedImage[]; mode: ImageGenerationMode }> {
  if (isMockMode()) {
    return {
      images: createMockImages(request.assetType, request.count),
      mode: "mock"
    };
  }

  return {
    images: await generateDashScopeImages(request, prompt),
    mode: "real"
  };
}

function isMockMode() {
  return process.env.MOCK_IMAGE_GENERATION !== "false";
}

async function generateDashScopeImages(
  request: GenerateAssetRequest,
  prompt: PromptBuildResult
): Promise<GeneratedImage[]> {
  const apiKey = process.env.DASHSCOPE_API_KEY?.trim();
  const model = process.env.IMAGE_MODEL?.trim();
  const endpoint = process.env.DASHSCOPE_IMAGE_ENDPOINT?.trim() || DEFAULT_DASHSCOPE_IMAGE_ENDPOINT;

  if (!apiKey) {
    throw new Error("Real image generation is enabled but DASHSCOPE_API_KEY is not configured.");
  }

  if (!model) {
    throw new Error("Real image generation is enabled but IMAGE_MODEL is not configured.");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(buildDashScopeRequestBody(model, request, prompt))
  });

  const payload = await parseResponsePayload(response);

  if (!response.ok) {
    throw new Error(`DashScope image generation failed (${response.status}): ${formatError(payload)}`);
  }

  const images = extractGeneratedImages(payload);

  if (images.length > 0) {
    return images.slice(0, request.count);
  }

  const taskId = getTaskId(payload);
  if (taskId) {
    const taskPayload = await pollDashScopeTask(taskId, apiKey);
    const taskImages = extractGeneratedImages(taskPayload);

    if (taskImages.length > 0) {
      return taskImages.slice(0, request.count);
    }
  }

  throw new Error("DashScope image generation succeeded but returned no image URL.");
}

function buildDashScopeRequestBody(
  model: string,
  request: GenerateAssetRequest,
  prompt: PromptBuildResult
) {
  return {
    model,
    input: {
      messages: [
        {
          role: "user",
          content: [
            {
              text: prompt.positivePrompt
            }
          ]
        }
      ]
    },
    parameters: {
      negative_prompt: prompt.negativePrompt,
      prompt_extend: false,
      watermark: false,
      size: toDashScopeImageSize(request.size),
      n: request.count
    }
  };
}

function toDashScopeImageSize(size: GenerateAssetRequest["size"]) {
  const [width, height] = size.split("x").map(Number);
  const normalizedWidth = Math.max(width, 512);
  const normalizedHeight = Math.max(height, 512);

  return `${normalizedWidth}*${normalizedHeight}`;
}

async function pollDashScopeTask(taskId: string, apiKey: string): Promise<unknown> {
  const taskEndpoint = process.env.DASHSCOPE_TASK_ENDPOINT?.trim() || DEFAULT_DASHSCOPE_TASK_ENDPOINT;
  const attempts = readPositiveInteger(process.env.DASHSCOPE_TASK_POLL_ATTEMPTS, DEFAULT_TASK_POLL_ATTEMPTS);
  const intervalMs = readPositiveInteger(
    process.env.DASHSCOPE_TASK_POLL_INTERVAL_MS,
    DEFAULT_TASK_POLL_INTERVAL_MS
  );

  for (let index = 0; index < attempts; index += 1) {
    if (index > 0) {
      await delay(intervalMs);
    }

    const response = await fetch(`${taskEndpoint}/${encodeURIComponent(taskId)}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });
    const payload = await parseResponsePayload(response);

    if (!response.ok) {
      throw new Error(`DashScope task polling failed (${response.status}): ${formatError(payload)}`);
    }

    const status = getTaskStatus(payload);

    if (status === "SUCCEEDED") {
      return payload;
    }

    if (status === "FAILED" || status === "CANCELED" || status === "SUSPENDED") {
      throw new Error(`DashScope task ${status.toLowerCase()}: ${formatError(payload)}`);
    }

    const images = extractGeneratedImages(payload);
    if (images.length > 0) {
      return payload;
    }
  }

  throw new Error("DashScope task polling timed out before image generation completed.");
}

async function parseResponsePayload(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function extractGeneratedImages(payload: unknown): GeneratedImage[] {
  const images: GeneratedImage[] = [];
  collectImageUrls(payload, images);

  return images.filter((image, index, all) => all.findIndex((item) => item.url === image.url) === index);
}

function collectImageUrls(value: unknown, images: GeneratedImage[]) {
  const directUrl = getString(value);
  if (directUrl && isGeneratedImageUrl(directUrl)) {
    images.push({ url: directUrl });
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectImageUrls(item, images));
    return;
  }

  const record = getRecord(value);
  if (!record) {
    return;
  }

  const seed = getString(record.seed);
  const url =
    getString(record.url) ||
    getString(record.image_url) ||
    getString(record.output_image_url) ||
    getString(record.image);

  if (url && isGeneratedImageUrl(url)) {
    images.push({ url, seed });
  }

  Object.values(record).forEach((item) => collectImageUrls(item, images));
}

function getTaskId(payload: unknown) {
  const output = getRecord(getRecord(payload)?.output);
  return getString(output?.task_id);
}

function getTaskStatus(payload: unknown) {
  const output = getRecord(getRecord(payload)?.output);
  return getString(output?.task_status);
}

function formatError(payload: unknown) {
  if (typeof payload === "string") {
    return payload;
  }

  const record = getRecord(payload);
  const message = getString(record?.message) || getString(record?.error) || getString(record?.code);
  return message || "Unknown provider error";
}

function getRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function getArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function getString(value: unknown): string | undefined {
  if (typeof value === "number") {
    return String(value);
  }

  return typeof value === "string" && value.trim() ? value : undefined;
}

function isGeneratedImageUrl(value: string) {
  return (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:image/")
  );
}

function readPositiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
