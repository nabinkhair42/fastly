import { type StatsData, fetchStats } from "@/services/download";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

type ApiError = Error & {
  message: string;
};

/**
 * Hook to initiate product bundle download from /api/download
 */
export const useDownload = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/download");

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error?.message || "Failed to download file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "create-fastly-app.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onMutate: () => {
      toast.loading("Preparing your download…", { id: "download-status" });
    },
    onSuccess: () => {
      toast.success("Download started!", { id: "download-status" });
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
 */
export const useFetchStats = () => {
  return useQuery<StatsData, ApiError>({
    queryKey: ["stats"],
    queryFn: async () => {
      try {
        const response = await fetchStats();
        return response.data;
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        throw new Error("Failed to load statistics");
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
