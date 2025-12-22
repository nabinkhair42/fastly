"use client";

import { type StatsData, type StatsResponse, fetchStats, downloadSaaSStarter } from "@/services/download";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

type ApiError = Error & {
  message: string;
};

/**
 * Hook to initiate product bundle download from /api/download
 * Returns mutation object with download function and loading state
 * Refetches stats after successful download to update the counter
 */
export const useDownload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: downloadSaaSStarter,
    onMutate: () => {
      toast.loading("Preparing your download…", { id: "download-status" });
    },
    onSuccess: () => {
      toast.success("Download started!", { id: "download-status" });

      // Refetch stats to update the download count immediately
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (error: ApiError) => {
      console.error("Download failed:", error);
      toast.error(error.message || "Failed to download. Please try again.", {
        id: "download-status",
        duration: 4000,
      });
    },
  });
};

/**
 * Hook to fetch download statistics
 * Returns query object with download count and loading state
 */
export const useFetchStats = () => {
  return useQuery<StatsData, ApiError>({
    queryKey: ["stats"],
    queryFn: async (): Promise<StatsData> => {
      try {
        const response: StatsResponse = await fetchStats();

        // Verify data exists
        if (!response || !response.data) {
          throw new Error("Invalid stats response");
        }

        return response.data;
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        throw new Error("Failed to load statistics");
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
