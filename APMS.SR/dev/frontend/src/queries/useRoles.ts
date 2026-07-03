// queries/useRoles.ts

import { useQuery } from "@tanstack/react-query";
import { fetchRoles } from "../api/role.api";
import type { Role } from "../auth/auth.types";

export const useRoles = () =>
  useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: fetchRoles,
    initialData: [],
  });
