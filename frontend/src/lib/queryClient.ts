import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,          // 30 seconds: data is fresh for 30s
      gcTime: 1000 * 60 * 5,         // 5 minutes: keep in cache
      retry: 2,
      refetchOnWindowFocus: true,    // auto-refresh when tab regains focus
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
