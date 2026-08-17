// queries/useRoles.ts

import { useQuery } from "@tanstack/react-query";

import { fetchRoles } from "../api/role.api";
import type { Role } from "../queries/role";

export const useRoles = () =>
  useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: fetchRoles,

    initialData: [],

    // 관리자 페이지에서는 최신 RBAC 상태 우선
    staleTime: 0,
    refetchOnMount: "always",
  });
