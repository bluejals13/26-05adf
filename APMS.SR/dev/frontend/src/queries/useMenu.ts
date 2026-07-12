// queries/useMenu.ts			//단일 메뉴 상태 관리

import { useQuery } from "@tanstack/react-query";
import { menuApi } from "../api/menu.api";
import { useAuthStore } from "../store/auth.store";

export function useMenu(id: number) {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["menu", id],
    queryFn: () => menuApi.getMenu(id),
    enabled: !!token && !!id,
  });
}
