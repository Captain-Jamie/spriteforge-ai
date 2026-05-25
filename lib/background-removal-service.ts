import { createHmac, randomUUID } from "node:crypto";
import ViapiUtil from "@alicloud/viapi-utils";
import type { GeneratedImage } from "./asset-schema";

const ALIYUN_IMAGESEG_ENDPOINT = "https://imageseg.cn-shanghai.aliyuncs.com/";
const ALIYUN_IMAGESEG_VERSION = "2019-12-30";

type AliyunCredentials = {
  accessKeyId: string;
  accessKeySecret: string;
};

export async function removeImageBackground(image: GeneratedImage): Promise<GeneratedImage> {
  const credentials = readAliyunCredentials();
  const outputUrl = await segmentCommonImage(image.url, credentials);

  return {
    ...image,
    url: outputUrl
  };
}

function readAliyunCredentials(): AliyunCredentials {
  const rawCredentials = process.env.ALIYUN_VIAPI_CREDENTIALS?.trim();

  if (!rawCredentials) {
    throw new Error(
      "Transparent background post-processing requires ALIYUN_VIAPI_CREDENTIALS."
    );
  }

  const separatorIndex = rawCredentials.indexOf(":");
  const accessKeyId = rawCredentials.slice(0, separatorIndex).trim();
  const accessKeySecret = rawCredentials.slice(separatorIndex + 1).trim();

  if (separatorIndex <= 0 || !accessKeyId || !accessKeySecret) {
    throw new Error(
      "ALIYUN_VIAPI_CREDENTIALS must use the format AccessKeyId:AccessKeySecret."
    );
  }

  return { accessKeyId, accessKeySecret };
}

async function segmentCommonImage(imageUrl: string, credentials: AliyunCredentials) {
  if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
    throw new Error("Transparent background post-processing requires an http image URL.");
  }

  const segmentableImageUrl = await toSegmentableImageUrl(imageUrl, credentials);
  const requestUrl = buildSignedAliyunUrl(credentials, {
    Action: "SegmentCommonImage",
    ImageURL: segmentableImageUrl
  });

  const response = await fetch(requestUrl, {
    method: "POST"
  });
  const payload = await parseResponsePayload(response);

  if (!response.ok) {
    throw new Error(`Aliyun image segmentation failed (${response.status}): ${formatError(payload)}`);
  }

  const outputUrl = extractSegmentedImageUrl(payload);

  if (!outputUrl) {
    throw new Error("Aliyun image segmentation succeeded but returned no image URL.");
  }

  return outputUrl;
}

async function toSegmentableImageUrl(imageUrl: string, credentials: AliyunCredentials) {
  if (isShanghaiOssUrl(imageUrl)) {
    return imageUrl;
  }

  try {
    return await ViapiUtil.upload(credentials.accessKeyId, credentials.accessKeySecret, imageUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown upload error";
    throw new Error(`Aliyun image URL preparation failed: ${message}`);
  }
}

function isShanghaiOssUrl(imageUrl: string) {
  try {
    const { hostname } = new URL(imageUrl);
    return hostname.endsWith(".oss-cn-shanghai.aliyuncs.com");
  } catch {
    return false;
  }
}

function buildSignedAliyunUrl(credentials: AliyunCredentials, businessParams: Record<string, string>) {
  const params: Record<string, string> = {
    ...businessParams,
    Format: "JSON",
    Version: ALIYUN_IMAGESEG_VERSION,
    AccessKeyId: credentials.accessKeyId,
    SignatureMethod: "HMAC-SHA1",
    Timestamp: formatAliyunTimestamp(new Date()),
    SignatureVersion: "1.0",
    SignatureNonce: randomUUID(),
    RegionId: "cn-shanghai"
  };

  const canonicalQuery = buildCanonicalQuery(params);
  const stringToSign = `POST&${percentEncode("/")}&${percentEncode(canonicalQuery)}`;
  const signature = createHmac("sha1", `${credentials.accessKeySecret}&`)
    .update(stringToSign)
    .digest("base64");
  const signedQuery = `Signature=${percentEncode(signature)}&${canonicalQuery}`;

  return `${ALIYUN_IMAGESEG_ENDPOINT}?${signedQuery}`;
}

function buildCanonicalQuery(params: Record<string, string>) {
  return Object.keys(params)
    .sort()
    .map((key) => `${percentEncode(key)}=${percentEncode(params[key])}`)
    .join("&");
}

function percentEncode(value: string) {
  return encodeURIComponent(value)
    .replace(/\+/g, "%20")
    .replace(/\*/g, "%2A")
    .replace(/%7E/g, "~");
}

function formatAliyunTimestamp(date: Date) {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
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

function extractSegmentedImageUrl(payload: unknown) {
  const data = getRecord(getRecord(payload)?.Data);
  return getString(data?.ImageURL);
}

function formatError(payload: unknown) {
  if (typeof payload === "string") {
    return payload;
  }

  const record = getRecord(payload);
  return (
    getString(record?.Message) ||
    getString(record?.message) ||
    getString(record?.Code) ||
    getString(record?.code) ||
    "Unknown provider error"
  );
}

function getRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function getString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}
