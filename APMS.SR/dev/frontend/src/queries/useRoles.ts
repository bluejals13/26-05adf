import { useQuery } from "@tanstack/react-query";
import { fetchRoles } from "../api/role.api";

export const useRoles = () =>
  useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: fetchRoles,
    initialData: [],
  });
