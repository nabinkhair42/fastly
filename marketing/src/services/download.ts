import api from "@/lib/axios";

/**
 * Downloads the SaaS starter app from GitHub Release
 * Calls /api/download which fetches from GitHub Release and redirects
 * The browser automatically downloads the file from the redirect
 */
export async function downloadSaaSStarter(): Promise<void> {
  try {
    // Create a temporary link to trigger the download
    // The API endpoint will handle the redirect to GitHub Release asset
    const link = document.createElement("a");
    link.href = "/api/download";
    link.download = "create-fastly-app.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to download file"
    );
  }
}

/**
 * Download statistics data structure
 */
export interface StatsData {
  totalDownloads: number;
  lastUpdated?: string;
}

/**
 * API response structure for stats endpoint
 */
export interface StatsResponse {
  data: StatsData;
}

/**
 * Fetches download statistics from the API
 * Returns the wrapped response: { data: { totalDownloads, lastUpdated } }
 */
export const fetchStats = async (): Promise<StatsResponse> => {
  const response = await api.get<StatsResponse>("/stats");
  return response.data;
};
