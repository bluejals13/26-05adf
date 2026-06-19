// mutations/useMenuMutations.ts			//상태 변경 관리

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { menuApi, MenuRequest } from "../api/menu.api";

export function useMenuMutations() {
  const qc = useQueryClient();

  const createMenu = useMutation({
    mutationFn: (data: MenuRequest) => menuApi.createMenu(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["menus"] }),
  });

  const deleteMenu = useMutation({
    mutationFn: (id: number) => menuApi.deleteMenu(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["menus"] }),
  });

  return { createMenu, deleteMenu };
}