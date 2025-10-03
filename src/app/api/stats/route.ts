import dbConnect from '@/lib/db-connect';
import AppStats from '@/models/app-stats';
import { NextResponse } from 'next/server';

type StatsResponse = {
  totalDownloads: number;
  lastUpdated: string;
};

export const GET = async () => {
  try {
    await dbConnect();

    const latestStats = await AppStats.findOne().sort({ updatedAt: -1 }).lean<{
      totalDownloads?: number;
      lastUpdated?: Date;
      updatedAt?: Date;
    } | null>();

    const stats: StatsResponse = {
      totalDownloads: latestStats?.totalDownloads ?? 0,
      lastUpdated: (latestStats?.lastUpdated ?? latestStats?.updatedAt ?? new Date()).toISOString(),
    };

    return NextResponse.json({ data: stats });
  } catch (error) {
    console.error('Failed to fetch stats', error);
    return NextResponse.json(
      {
        error: 'Unable to fetch stats right now.',
      },
      { status: 500 }
    );
  }
};
