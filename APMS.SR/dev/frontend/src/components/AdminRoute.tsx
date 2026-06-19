// components/AdminRoute.tsx			role 체크

import { Navigate, Outlet } from "react-router-dom";
import FullPageSpinner from "./loading/FullPageSpinner";
import { useMe } from "../queries/useMe";
import { usePermissions } from "../auth/hooks/usePermissions";
import type { Permission } from "../auth/auth.types";
import type { User } from "../auth/auth.types";

// 필요하면 string 기반으로
type AdminRouteProps = { permission?: Permission; };

export default function AdminRoute({ permission }: AdminRouteProps) {
  const { data: me, isLoading } = useMe();
  const { hasPermission } = usePermissions(me);

  if (isLoading) return <FullPageSpinner />;
  if (!me) return <Navigate to="/login" replace />;

  // 기본 admin gate (권한 기반)
  const isAdmin = me.roles.includes("ADMIN");

  // permission이 있으면 그것 기준으로 체크
  if (permission && !hasPermission(permission)) { return <Navigate to="/403" replace />; }

  if (!isAdmin) return <Navigate to="/403" replace />;

  return <Outlet />;
}
