import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, //5p
      refetchOnWindowFocus: false,
    },
  },
});

export default queryClient;
