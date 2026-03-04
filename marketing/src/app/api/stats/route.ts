import { NextResponse } from "next/server";
import dbConnect from "@/lib/db-connect";
import AppStats from "@/models/app-stats";

export async function GET() {
  try {
    await dbConnect();
    
    const stats = await AppStats.findOne({});
    
    return NextResponse.json({
      data: {
        totalDownloads: stats?.totalDownloads ?? 0,
      },
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json(
      { message: "Failed to load statistics" },
      { status: 500 }
    );
  }
}
