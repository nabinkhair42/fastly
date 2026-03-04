import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import dbConnect from "@/lib/db-connect";
import AppStats from "@/models/app-stats";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "create-fastly-app.zip");
    const fileBuffer = await readFile(filePath);

    // Track download in database
    try {
      await dbConnect();
      await AppStats.findOneAndUpdate(
        {},
        { $inc: { totalDownloads: 1 }, lastUpdated: new Date() },
        { upsert: true, new: true }
      );
    } catch (dbError) {
      console.error("Failed to update download stats:", dbError);
      // Continue with download even if stats update fails
    }

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=create-fastly-app.zip",
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Download failed:", error);
    return NextResponse.json(
      { message: "Failed to download file" },
      { status: 500 }
    );
  }
}
