// src/queryClient.ts    // 일반 고객용 계시판 혹은 상품 , 댓글 같은 잡다 기능용 쿼리

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60, // 1분 간격으로
    },
  },
});
