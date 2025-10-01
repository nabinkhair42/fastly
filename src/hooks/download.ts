import {
  downloadSaaSStarter,
  fetchStats,
  StatsData,
} from '@/services/useDownload';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

type ApiError = Error & {
  response?: {
    data?: {
      message?: string;
    };
  };
};

const extractErrorMessage = (error: ApiError, fallback: string) => {
  return error.response?.data?.message ?? fallback;
};

export const useDownload = () => {
  return useMutation<void, ApiError>({
    mutationFn: async () => {
      return toast.promise(downloadSaaSStarter(), {
        loading: 'Preparing your download',
        success: 'Download started successfully!',
        error: (error: ApiError) =>
          extractErrorMessage(error, 'Failed to download. Please try again.'),
      });
    },
    onError: error => {
      console.error('Download failed:', error);
    },
  });
};

export const useFetchStats = () => {
  return useQuery<StatsData, ApiError>({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await fetchStats();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
