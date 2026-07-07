import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { extractData } from '../apiClient';

// Re-export folder hooks for convenience
export { useFolders, useCreateFolder, type FolderDto } from './useFolders';

// ── Types mirroring backend FileDto ────────────────────────────────────────────
export interface FileDto {
  id: string;
  name: string;
  originalName: string;
  folderId: string | null;
  ownerId: string;
  mimeType: string;
  sizeBytes: number;
  checksumSha256: string;
  storageTier: string;
  isDuplicate: boolean;
  duplicateOfId: string | null;
  versionNumber: number;
  isCurrentVersion: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FileVersion {
  id: string;
  versionNumber: number;
  sizeBytes: number;
  checksumSha256: string;
  changeSummary: string;
  createdAt: string;
}

// ── Query Keys ─────────────────────────────────────────────────────────────────
export const fileKeys = {
  all:      ['files']            as const,
  byFolder: (folderId?: string) => ['files', 'folder', folderId ?? 'root'] as const,
  trash:    ()                   => ['files', 'trash'] as const,
  versions: (fileId: string)    => ['files', fileId, 'versions'] as const,
};

// ── Fetch files by folder ─────────────────────────────────────────────────────
export const useFiles = (folderId?: string) => {
  return useQuery({
    queryKey: fileKeys.byFolder(folderId),
    queryFn: async () => {
      const params = folderId ? { folderId } : {};
      const res = await apiClient.get('/api/storage/files', { params });
      return extractData<FileDto[]>(res);
    },
  });
};

// ── Fetch trash ───────────────────────────────────────────────────────────────
export const useTrash = () => {
  return useQuery({
    queryKey: fileKeys.trash(),
    queryFn: async () => {
      const res = await apiClient.get('/api/files/trash');
      return extractData<FileDto[]>(res);
    },
  });
};

// ── Fetch file versions ───────────────────────────────────────────────────────
export const useFileVersions = (fileId: string) => {
  return useQuery({
    queryKey: fileKeys.versions(fileId),
    queryFn: async () => {
      const res = await apiClient.get(`/api/files/${fileId}/versions`);
      return extractData<FileVersion[]>(res);
    },
    enabled: !!fileId,
  });
};

// ── Upload file (with XMLHttpRequest for progress tracking) ───────────────────
export const useUploadFile = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      folderId,
      onProgress,
    }: {
      file: File;
      folderId?: string;
      onProgress?: (percent: number) => void;
    }): Promise<FileDto> => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file);
        if (folderId) formData.append('folderId', folderId);

        const xhr = new XMLHttpRequest();
        const token = localStorage.getItem('intellistore_token');

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable && onProgress) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const body = JSON.parse(xhr.responseText);
            resolve(body.data as FileDto);
          } else {
            try {
              const body = JSON.parse(xhr.responseText);
              reject(new Error(body.message || `Upload failed: ${xhr.status}`));
            } catch {
              reject(new Error(`Upload failed: HTTP ${xhr.status}`));
            }
          }
        });

        xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
        xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8085';
        xhr.open('POST', `${baseUrl}/api/storage/files`);
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });
    },
    onSuccess: (_data, variables) => {
      // Invalidate the folder's file list so explorer auto-updates
      qc.invalidateQueries({ queryKey: fileKeys.byFolder(variables.folderId) });
      qc.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
};

// ── Soft delete (move to trash) ───────────────────────────────────────────────
export const useDeleteFile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (fileId: string) => apiClient.delete(`/api/files/${fileId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: fileKeys.all });
      qc.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
};

// ── Restore from trash ────────────────────────────────────────────────────────
export const useRestoreFile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (fileId: string) => apiClient.post(`/api/files/${fileId}/restore`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: fileKeys.all });
    },
  });
};

// ── Permanently delete ────────────────────────────────────────────────────────
export const usePermanentDelete = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (fileId: string) => apiClient.delete(`/api/files/${fileId}/permanent`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: fileKeys.trash() });
    },
  });
};

// ── Download file via presigned URL ──────────────────────────────────────────
export const downloadFile = async (fileId: string, fileName: string) => {
  const token = localStorage.getItem('intellistore_token');
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8085';
  const res = await fetch(`${baseUrl}/api/storage/files/${fileId}/download`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Download failed: HTTP ${res.status}`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};
