import api from '@/lib/axios';

export async function downloadSaaSStarter(): Promise<void> {
  const response = await api.get('/download', { responseType: 'blob' });

  const blob = new Blob([response.data], { type: 'application/zip' });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'my-saas-app.zip';
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export interface StatsData {
  totalDownloads: number;
}

interface StatsResponse {
  data: StatsData;
}

export const fetchStats = async (): Promise<StatsResponse> => {
  const response = await api.get<StatsResponse>('/stats');
  return response.data;
};
