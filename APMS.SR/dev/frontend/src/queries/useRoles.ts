import { useQuery } from "@tanstack/react-query";
import { fetchRoles } from "../api/role.api";

export const useRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });
};
