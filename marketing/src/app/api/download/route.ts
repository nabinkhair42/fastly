import { NextResponse } from "next/server";
import JSZip from "jszip";
import dbConnect from "@/lib/db-connect";
import AppStats from "@/models/app-stats";

const GITHUB_REPO_OWNER = "nabinkhair42";
const GITHUB_REPO_NAME = "fastly";
const GITHUB_BRANCH = "main";
const TARGET_FOLDER = "main-app";

/**
 * Fetches the latest version of the repository from GitHub,
 * extracts only the main-app folder, and returns it as a new zip
 */
async function fetchMainAppFromGitHub(): Promise<ArrayBuffer> {
  const downloadUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/zipball/${GITHUB_BRANCH}`;

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "create-fastly-app",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(downloadUrl, {
    headers,
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  const repoZipBuffer = await response.arrayBuffer();
  const repoZip = await JSZip.loadAsync(repoZipBuffer);

  // GitHub zipball has a root folder like "owner-repo-hash/"
  // Find the root folder name dynamically
  const rootFolder = Object.keys(repoZip.files).find((name) => name.endsWith("/"))?.split("/")[0];
  
  if (!rootFolder) {
    throw new Error("Invalid zip structure from GitHub");
  }

  const mainAppPrefix = `${rootFolder}/${TARGET_FOLDER}/`;
  const newZip = new JSZip();

  // Extract only main-app folder contents
  for (const [relativePath, file] of Object.entries(repoZip.files)) {
    if (relativePath.startsWith(mainAppPrefix) && !file.dir) {
      // Remove the prefix to flatten the structure
      const newPath = relativePath.slice(mainAppPrefix.length);
      if (newPath) {
        const content = await file.async("uint8array");
        newZip.file(newPath, content);
      }
    }
  }

  return newZip.generateAsync({ type: "arraybuffer", compression: "DEFLATE" });
}

export async function GET() {
  try {
    // Fetch and extract main-app folder from GitHub
    const zipBuffer = await fetchMainAppFromGitHub();

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

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=create-fastly-app.zip",
        "Content-Length": zipBuffer.byteLength.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Download failed:", error);
    return NextResponse.json(
      { message: "Failed to download file. Please try again later." },
      { status: 500 }
    );
  }
}
