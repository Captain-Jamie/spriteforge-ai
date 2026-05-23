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
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unexpected export error"
      },
      { status: 500 }
    );
  }
}
