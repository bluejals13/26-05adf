// mutations/useMenuMutations.ts			//상태 변경 관리

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { menuApi } from "../api/menu.api";

import type { MenuRequest } from "../auth/auth.types";

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

  const updateMenu = useMutation({
    mutationFn: ({id,data} : {id: number; data: MenuRequest; }) => menuApi.updateMenu(id, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["menus"] });
      qc.invalidateQueries({ queryKey: ["menu", variables.id] });
      }
  });

  return { createMenu, deleteMenu, updateMenu };
}
