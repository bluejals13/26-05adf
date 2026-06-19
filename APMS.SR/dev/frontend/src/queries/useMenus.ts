// queries/useMenus.ts			//서버 상태 관리

import { useQuery } from "@tanstack/react-query";
import { menuApi } from "../api/menu.api";
import { useAuthStore } from "../store/auth.store";

export function useMenus() {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["menus"],
    queryFn: menuApi.getMenus,
    enabled: !!token,
  });
}
