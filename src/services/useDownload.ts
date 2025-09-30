import api from '@/lib/config/axios';

export const downloadService = {
  downloadSaaSStarter: async (): Promise<Blob> => {
    const response = await api.get('/download', {
      responseType: 'blob',
    });
    return response.data;
  },
};
