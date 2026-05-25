import { NextResponse } from "next/server";
import JSZip from "jszip";
import { SpriteSheetRequestSchema } from "@/lib/asset-schema";
import { buildSpriteSheet } from "@/lib/spritesheet-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = SpriteSheetRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid sprite sheet request",
          issues: parsed.error.flatten()
        },
        { status: 400 }
      );
    }

    const spriteSheet = await buildSpriteSheet(parsed.data);
    const zip = new JSZip();

    zip.file("spritesheet.png", spriteSheet.imageBuffer);
    zip.file(
      "frames.json",
      JSON.stringify(
        {
          ...spriteSheet.metadata,
          frames: spriteSheet.frames
        },
        null,
        2
      )
    );

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    return new NextResponse(new Uint8Array(zipBuffer), {
      headers: {
        "Content-Disposition": 'attachment; filename="spriteforge-spritesheet.zip"',
        "Content-Type": "application/zip"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected sprite sheet error";

    return NextResponse.json(
      {
        error: message
      },
      { status: getSpriteSheetErrorStatus(message) }
    );
  }
}

function getSpriteSheetErrorStatus(message: string) {
  if (message.includes("Unsupported sprite sheet image URL format")) {
    return 400;
  }

  if (
    message.includes("Failed to fetch sprite sheet image") ||
    message.includes("Sprite sheet image response is empty")
  ) {
    return 502;
  }

  return 500;
}
