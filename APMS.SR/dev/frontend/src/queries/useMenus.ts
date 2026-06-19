// queries/useMenus.ts			//서버 상태 관리

import { useQuery } from "@tanstack/react-query";
import { menuApi } from "../api/menu.api";

import { useAuth } from "../auth/hooks/useAuth";

export function useMenus() {
  const { user, isLoading } = useAuth();

  return useQuery({
    queryKey: ["menus"],
    queryFn: menuApi.getMenus,
    enabled: !!user && !isLoading,
  });
}
