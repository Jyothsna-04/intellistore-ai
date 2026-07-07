import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { extractData } from '../apiClient';

export interface FolderDto {
  id: string;
  name: string;
  parentId: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export const folderKeys = {
  all:      ['folders'] as const,
  byParent: (parentId?: string) => ['folders', 'parent', parentId ?? 'root'] as const,
};

export const useFolders = (parentId?: string) =>
  useQuery({
    queryKey: folderKeys.byParent(parentId),
    queryFn: async () => {
      const params = parentId ? { parentId } : {};
      const res = await apiClient.get('/api/storage/folders', { params });
      return extractData<FolderDto[]>(res);
    },
  });

export const useCreateFolder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; parentId?: string }) =>
      apiClient.post('/api/storage/folders', payload).then(r => extractData<FolderDto>(r)),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: folderKeys.byParent(variables.parentId) });
    },
  });
};
