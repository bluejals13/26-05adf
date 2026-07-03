// queries/useRoles.ts

import { useQuery } from "@tanstack/react-query";
import { fetchRoles } from "../api/role.api";
import type { Role } from "../queries/role";

export const useRoles = () =>
  useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: fetchRoles,
    initialData: [],
  });
