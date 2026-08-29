// src/queries/usePermissions.ts

import { useQuery } from "@tanstack/react-query";

import {
  getPermissions,
  getPermission,
} from "../api/permission.api";

export const permissionKeys = {
  all: ["permissions"] as const,

  detail: (id: number) =>
    ["permission", id] as const,
};

export const usePermissions = (
  enabled = true
) => {
  return useQuery({
    queryKey: permissionKeys.all,
    queryFn: getPermissions,
    enabled,
  });
};

export const usePermission = (
  id: number | null,
  enabled = true
) => {
  return useQuery({
    queryKey:
      id !== null
        ? permissionKeys.detail(id)
        : ["permission", null],

    queryFn: () =>
      getPermission(id as number),

    enabled:
      enabled && id !== null,
  });
};
