import { readFile } from "node:fs/promises";
import { join } from "node:path";
import dbConnect from "@/lib/db-connect";
import AppStats from "@/models/app-stats";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    // Update download stats
    await dbConnect();
    await AppStats.findOneAndUpdate(
      {},
      { $inc: { totalDownloads: 1 }, lastUpdated: new Date() },
      { upsert: true, new: true },
    );

    // Read the zip file from public folder
    const zipPath = join(process.cwd(), "public", "create-fastly-app.zip");
    const fileBuffer = await readFile(zipPath);

    // Return the zip file with appropriate headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="create-fastly-app.zip"',
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Download API error:", message);
    return NextResponse.json(
      { message: "Failed to download file", error: message },
      { status: 500 },
    );
  }
}
