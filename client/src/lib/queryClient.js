/**
 * queryClient.js
 * TanStack Query Client Configuration
 *
 * Authority: ARCHITECTURE_REVISION.md Section 7.2 (lib/)
 *            DEVELOPMENT_ORDER.md Section 11 (Step 2)
 */

import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5 minute stale time — data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Do not retry on 401/403/404 — these are definitive responses
      retry: (failureCount, error) => {
        const status = error?.response?.status;
        if (status === 401 || status === 403 || status === 404) return false;
        return failureCount < 2;
      },
      // Refetch on window focus in production only
      refetchOnWindowFocus: import.meta.env.PROD,
    },
    mutations: {
      // Do not retry mutations automatically
      retry: false,
    },
  },
});

export default queryClient;
