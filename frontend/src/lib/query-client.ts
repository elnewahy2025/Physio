import { QueryClient } from "@tanstack/react-query";

/**
 * Create a configured QueryClient instance
 * This can be extended with default options, global error handling, etc.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // With SSR/SSG, we might want to set staleTime to Infinity
      // For now, we use a reasonable default
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
