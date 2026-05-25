import { NextResponse } from "next/server";
import { ExportApiRequestSchema } from "@/lib/asset-schema";
import { buildExportZip } from "@/lib/export-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ExportApiRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid export request",
          issues: parsed.error.flatten()
        },
        { status: 400 }
      );
    }

    const zipBuffer = await buildExportZip(parsed.data);

    return new NextResponse(new Uint8Array(zipBuffer), {
      headers: {
        "Content-Disposition": 'attachment; filename="spriteforge-export.zip"',
        "Content-Type": "application/zip"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected export error";

    return NextResponse.json(
      {
        error: message
      },
      { status: getExportErrorStatus(message) }
    );
  }
}

function getExportErrorStatus(message: string) {
  if (message.includes("Unsupported asset image URL format")) {
    return 400;
  }

  if (message.includes("Failed to fetch remote image") || message.includes("Remote image response is empty")) {
    return 502;
  }

  return 500;
}
