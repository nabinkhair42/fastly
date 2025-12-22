import { NextResponse } from "next/server";
import dbConnect from "@/lib/db-connect";
import AppStats from "@/models/app-stats";

export const runtime = "nodejs";

// GitHub Release Configuration
const GITHUB_REPO_OWNER = "nabinkhair42";
const GITHUB_REPO_NAME = "fastly";
const GITHUB_RELEASE_TAG = "latest";
const ZIP_ASSET_NAME = "create-fastly-app.zip"; // Name of the ZIP asset in GitHub Release

/**
 * Fetches the download URL from GitHub Release
 */
async function getGitHubReleaseAssetUrl(): Promise<string> {
  try {
    const apiUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/releases/${GITHUB_RELEASE_TAG}`;

    console.log("Fetching GitHub release from:", apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        // Optional: Add GitHub token for higher rate limits
        // Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const release = await response.json();

    // Find the ZIP asset
    const asset = release.assets?.find(
      (a: { name: string }) => a.name === ZIP_ASSET_NAME
    );

    if (!asset) {
      throw new Error(
        `ZIP asset "${ZIP_ASSET_NAME}" not found in GitHub release`
      );
    }

    console.log("Found release asset:", asset.browser_download_url);
    return asset.browser_download_url;
  } catch (error) {
    console.error("Failed to get GitHub release asset:", error);
    throw error;
  }
}

export async function GET() {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Update download statistics
    let stats = await AppStats.findOne({});
    if (!stats) {
      stats = await AppStats.create({
        totalDownloads: 1,
        lastUpdated: new Date(),
      });
    } else {
      stats.totalDownloads += 1;
      stats.lastUpdated = new Date();
      await stats.save();
    }

    console.log("Updated stats. Total downloads:", stats.totalDownloads);

    // Get GitHub Release asset URL
    const downloadUrl = await getGitHubReleaseAssetUrl();

    // Redirect to GitHub Release asset
    // This allows browser to download directly from GitHub
    return NextResponse.redirect(downloadUrl, {
      status: 302,
    });
  } catch (error) {
    console.error("Download error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch download";

    return NextResponse.json(
      {
        message: errorMessage,
        details:
          "The download file is not available. Please check GitHub releases.",
      },
      { status: 503 }
    );
  }
}
