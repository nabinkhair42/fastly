import { downloadService } from '@/services/useDownload';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useDownload = () => {
  return useMutation({
    mutationFn: async () => {
      const blob = await downloadService.downloadSaaSStarter();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'my-saas-app.zip';

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return blob;
    },
    onSuccess: () => {
      toast.success('Download started successfully!');
    },
    onError: error => {
      console.error('Download failed:', error);
      toast.error('Failed to download. Please try again.');
    },
  });
};
