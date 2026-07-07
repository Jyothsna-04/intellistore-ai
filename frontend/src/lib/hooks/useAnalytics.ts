import { useQuery } from '@tanstack/react-query';
import apiClient, { extractData } from '../apiClient';

export interface AnalyticsDto {
  totalFiles: number;
  totalFolders: number;
  totalStorageUsedBytes: number;
  totalStorageQuotaBytes: number;
  storageUtilizationPercent: number;
  totalUsers: number;
  activeUsers: number;
  totalShares: number;
  storageByMimeType: Record<string, number>;
  storageByDepartment: Record<string, number>;
  filesUploadedByMonth: Record<string, number>;
}

export const useAnalytics = () =>
  useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: async () => {
      const res = await apiClient.get('/api/analytics/dashboard');
      return extractData<AnalyticsDto>(res);
    },
    staleTime: 1000 * 60,   // 1 minute
    refetchInterval: 1000 * 60 * 2, // auto-refresh every 2 minutes
  });

/** Utility: format bytes to human readable string */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
