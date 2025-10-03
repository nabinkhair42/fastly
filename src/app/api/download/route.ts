import dbConnect from '@/lib/dbConnect';
import AppStats from '@/models/app-stats';
import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

const OWNER = 'nabinkhair42';
const REPO = 'fastly';
const FOLDER_PATH = 'my-saas-app';
const SERVER_URL = process.env.SERVER_URL!;

export async function GET(): Promise<NextResponse> {
  try {
    // Update download stats
    await dbConnect();
    await AppStats.findOneAndUpdate(
      {},
      { $inc: { totalDownloads: 1 }, lastUpdated: new Date() },
      { upsert: true, new: true }
    );

    const repolinkUrl = `${SERVER_URL}?owner=${OWNER}&repo=${REPO}&folder_path=${FOLDER_PATH}`;

    const res = await fetch(repolinkUrl, {
      headers: { accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`Repolink API error: ${res.statusText}`);

    const data = (await res.json()) as {
      success: boolean;
      message: string;
      data?: { download_url: string };
    };

    if (!data.success || !data.data?.download_url) {
      throw new Error(data.message || 'Failed to get download URL');
    }

    // Return JSON with download URL to client
    return NextResponse.json({ download_url: data.data.download_url });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Download API error:', message);
    return NextResponse.json(
      { message: 'Failed to start download', error: message },
      { status: 500 }
    );
  }
}
