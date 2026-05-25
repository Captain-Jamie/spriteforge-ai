import { NextResponse } from "next/server";
import { z } from "zod";

const CacheImageRequestSchema = z.object({
  imageUrl: z.string().min(1)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = CacheImageRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid cache image request",
          issues: parsed.error.flatten()
        },
        { status: 400 }
      );
    }

    const dataUrl = await imageUrlToDataUrl(parsed.data.imageUrl);

    return NextResponse.json({ dataUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected image cache error";

    return NextResponse.json(
      {
        error: message
      },
      { status: getCacheImageErrorStatus(message) }
    );
  }
}

async function imageUrlToDataUrl(imageUrl: string) {
  if (imageUrl.startsWith("data:")) {
    return imageUrl;
  }

  if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
    throw new Error("Unsupported cache image URL format");
  }

  let response: Response;

  try {
    response = await fetch(imageUrl);
  } catch (error) {
    throw new Error(
      `Failed to fetch image for local cache: ${error instanceof Error ? error.message : "network error"}`
    );
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch image for local cache (${response.status})`);
  }

  const contentType = response.headers.get("content-type")?.split(";")[0] || "image/png";
  const arrayBuffer = await response.arrayBuffer();

  if (arrayBuffer.byteLength === 0) {
    throw new Error("Image cache response is empty");
  }

  return `data:${contentType};base64,${Buffer.from(arrayBuffer).toString("base64")}`;
}

function getCacheImageErrorStatus(message: string) {
  if (message.includes("Unsupported cache image URL format")) {
    return 400;
  }

  if (
    message.includes("Failed to fetch image for local cache") ||
    message.includes("Image cache response is empty")
  ) {
    return 502;
  }

  return 500;
}
