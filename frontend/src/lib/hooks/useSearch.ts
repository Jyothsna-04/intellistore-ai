import { useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { useState } from 'react';
import apiClient, { extractData } from '../apiClient';

export interface SearchResultDto {
  id: string;
  type: 'FILE' | 'FOLDER';
  name: string;
  mimeType?: string;
  sizeBytes?: number;
  folderId?: string;
  similarity?: number;
  snippet?: string;
  createdAt: string;
}

export const useSearch = (initialQuery = '') => {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  const debounce = useDebouncedCallback((value: string) => {
    setDebouncedQuery(value);
  }, 400);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    debounce(value);
  };

  const results = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return [];
      const res = await apiClient.get('/api/search', { params: { q: debouncedQuery } });
      return extractData<SearchResultDto[]>(res);
    },
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 1000 * 10,
  });

  return { query, handleQueryChange, debouncedQuery, ...results };
};
