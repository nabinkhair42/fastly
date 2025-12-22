import { NextResponse } from "next/server";
import dbConnect from "@/lib/db-connect";
import AppStats from "@/models/app-stats";

export const runtime = "nodejs";

export async function GET() {
  try {
    await dbConnect();

    let stats = await AppStats.findOne({});

    if (!stats) {
      stats = await AppStats.create({
        totalDownloads: 0,
        lastUpdated: new Date(),
      });
    }

    if (!stats) {
      return NextResponse.json(
        { data: { totalDownloads: 0, lastUpdated: new Date().toISOString() } },
        { status: 500 }
      );
    }

    const totalDownloads = Number(stats.totalDownloads) || 0;
    const lastUpdated = stats.lastUpdated
      ? String(stats.lastUpdated)
      : new Date().toISOString();

    return NextResponse.json({
      data: {
        totalDownloads,
        lastUpdated,
      },
    });
  } catch (error) {
    console.error("Stats API Error:", error);

    return NextResponse.json(
      {
        data: {
          totalDownloads: 0,
          lastUpdated: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}
