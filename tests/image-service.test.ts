import { afterEach, describe, expect, it, vi } from "vitest";
import ViapiUtil from "@alicloud/viapi-utils";
import type { GenerateAssetRequest, PromptBuildResult } from "../lib/asset-schema";
import { generateImages } from "../lib/image-service";

vi.mock("@alicloud/viapi-utils", () => ({
  default: {
    upload: vi.fn(async () => "http://viapi-customer-temp.oss-cn-shanghai.aliyuncs.com/ak-id/test.png")
  }
}));

const baseRequest: GenerateAssetRequest = {
  description: "a small sword icon",
  assetType: "icon",
  style: "pixel_art",
  gameGenre: "rpg",
  view: "front",
  size: "128x128",
  background: "transparent",
  count: 2,
  styleProfile: {
    projectName: "",
    palette: "",
    lineStyle: "",
    lighting: "",
    viewRule: "",
    avoidElements: ""
  }
};

const basePrompt: PromptBuildResult = {
  positivePrompt: "pixel art sword icon",
  negativePrompt: "text, watermark",
  appliedStyleProfile: []
};

describe("generateImages", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.unstubAllGlobals();
    vi.mocked(ViapiUtil.upload).mockClear();
  });

  it("uses mock images only when explicitly enabled", async () => {
    process.env.MOCK_IMAGE_GENERATION = "true";

    const result = await generateImages({
      request: baseRequest,
      prompt: basePrompt
    });

    expect(result.mode).toBe("mock");
    expect(result.images).toHaveLength(2);
    expect(result.images[0].url).toContain("data:image/svg+xml");
  });

  it("requires an API key when real generation is enabled", async () => {
    process.env.MOCK_IMAGE_GENERATION = "false";
    process.env.IMAGE_MODEL = "wanx-v1";
    delete process.env.DASHSCOPE_API_KEY;

    await expect(
      generateImages({
        request: baseRequest,
        prompt: basePrompt
      })
    ).rejects.toThrow("DASHSCOPE_API_KEY");
  });

  it("maps DashScope result URLs in real generation mode", async () => {
    process.env.MOCK_IMAGE_GENERATION = "false";
    process.env.DASHSCOPE_API_KEY = "test-key";
    process.env.IMAGE_MODEL = "wanx-v1";
    process.env.DASHSCOPE_IMAGE_ENDPOINT = "https://example.test/image-generation";
    const solidRequest: GenerateAssetRequest = { ...baseRequest, background: "solid" };

    const fetchMock = vi.fn(async () => {
      return new Response(
        JSON.stringify({
          output: {
            results: [
              { url: "https://cdn.example.test/asset-1.png", seed: 101 },
              { image_url: "https://cdn.example.test/asset-2.png" }
            ]
          }
        }),
        { status: 200 }
      );
    });

    vi.stubGlobal("fetch", fetchMock);

    const result = await generateImages({
      request: solidRequest,
      prompt: basePrompt
    });

    expect(result.mode).toBe("real");
    expect(result.images).toEqual([
      { url: "https://cdn.example.test/asset-1.png", seed: "101" },
      { url: "https://cdn.example.test/asset-2.png", seed: undefined }
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.test/image-generation",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-key",
          "Content-Type": "application/json"
        })
      })
    );
    const requestBody = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(requestBody).toMatchObject({
      model: "wanx-v1",
      input: {
        messages: [
          {
            role: "user",
            content: [{ text: "pixel art sword icon" }]
          }
        ]
      },
      parameters: {
        negative_prompt: "text, watermark",
        prompt_extend: false,
        watermark: false,
        size: "512*512",
        n: 2
      }
    });
  });

  it("polls DashScope task results when the provider returns a task id", async () => {
    process.env.MOCK_IMAGE_GENERATION = "false";
    process.env.DASHSCOPE_API_KEY = "test-key";
    process.env.IMAGE_MODEL = "wanx-v1";
    process.env.DASHSCOPE_IMAGE_ENDPOINT = "https://example.test/image-generation";
    process.env.DASHSCOPE_TASK_ENDPOINT = "https://example.test/tasks";
    process.env.DASHSCOPE_TASK_POLL_ATTEMPTS = "3";
    process.env.DASHSCOPE_TASK_POLL_INTERVAL_MS = "1";
    const solidRequest: GenerateAssetRequest = { ...baseRequest, background: "solid" };

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            output: {
              task_id: "task-1",
              task_status: "PENDING"
            }
          }),
          { status: 200 }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            output: {
              task_id: "task-1",
              task_status: "RUNNING"
            }
          }),
          { status: 200 }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            output: {
              task_id: "task-1",
              task_status: "SUCCEEDED",
              choices: [
                {
                  message: {
                    content: [{ image: "https://cdn.example.test/task-result.png" }]
                  }
                }
              ]
            }
          }),
          { status: 200 }
        )
      );

    vi.stubGlobal("fetch", fetchMock);

    const result = await generateImages({
      request: solidRequest,
      prompt: basePrompt
    });

    expect(result.mode).toBe("real");
    expect(result.images).toEqual([{ url: "https://cdn.example.test/task-result.png", seed: undefined }]);
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://example.test/tasks/task-1",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-key"
        })
      })
    );
  });

  it("does not return mock data when the real provider fails", async () => {
    process.env.MOCK_IMAGE_GENERATION = "false";
    process.env.DASHSCOPE_API_KEY = "test-key";
    process.env.IMAGE_MODEL = "wanx-v1";

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        return new Response(JSON.stringify({ message: "quota exceeded" }), { status: 429 });
      })
    );

    await expect(
      generateImages({
        request: { ...baseRequest, background: "solid" },
        prompt: basePrompt
      })
    ).rejects.toThrow("quota exceeded");
  });

  it("requires Aliyun credentials for transparent real image post-processing", async () => {
    process.env.MOCK_IMAGE_GENERATION = "false";
    process.env.DASHSCOPE_API_KEY = "test-key";
    process.env.IMAGE_MODEL = "wanx-v1";
    process.env.DASHSCOPE_IMAGE_ENDPOINT = "https://example.test/image-generation";
    delete process.env.ALIYUN_VIAPI_CREDENTIALS;

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        return new Response(
          JSON.stringify({
            output: {
              results: [{ url: "https://cdn.example.test/source.png" }]
            }
          }),
          { status: 200 }
        );
      })
    );

    await expect(
      generateImages({
        request: baseRequest,
        prompt: basePrompt
      })
    ).rejects.toThrow("ALIYUN_VIAPI_CREDENTIALS");
  });

  it("replaces transparent real image URLs with Aliyun segmented PNG URLs", async () => {
    process.env.MOCK_IMAGE_GENERATION = "false";
    process.env.DASHSCOPE_API_KEY = "test-key";
    process.env.IMAGE_MODEL = "wanx-v1";
    process.env.DASHSCOPE_IMAGE_ENDPOINT = "https://example.test/image-generation";
    process.env.ALIYUN_VIAPI_CREDENTIALS = "ak-id:ak-secret";

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            output: {
              results: [{ url: "https://cdn.example.test/source.png", seed: 101 }]
            }
          }),
          { status: 200 }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            Data: {
              ImageURL: "https://cdn.example.test/segmented-alpha.png"
            }
          }),
          { status: 200 }
        )
      );

    vi.stubGlobal("fetch", fetchMock);

    const result = await generateImages({
      request: { ...baseRequest, count: 1 },
      prompt: basePrompt
    });

    expect(result.mode).toBe("real");
    expect(result.images).toEqual([
      { url: "https://cdn.example.test/segmented-alpha.png", seed: "101" }
    ]);
    expect(ViapiUtil.upload).toHaveBeenCalledWith(
      "ak-id",
      "ak-secret",
      "https://cdn.example.test/source.png"
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("Action=SegmentCommonImage"),
      expect.objectContaining({ method: "POST" })
    );
    expect(fetchMock.mock.calls[1][0]).toEqual(
      expect.stringContaining(
        "ImageURL=http%3A%2F%2Fviapi-customer-temp.oss-cn-shanghai.aliyuncs.com%2Fak-id%2Ftest.png"
      )
    );
  });
});
