// components/AdminRoute.tsx			role 체크

import { Navigate, Outlet } from "react-router-dom";
import FullPageSpinner from "./loading/FullPageSpinner";
import { useMe } from "../queries/useMe";
import { usePermissions } from "../auth/hooks/usePermissions";

interface ProtectedRouteProps {
  permission?: string;
}

export default function AdminRoute({
  permission,
}: ProtectedRouteProps) {
  const { data: me, isLoading } = useMe();

  if (isLoading) return <FullPageSpinner />;

  if (!me) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !me.permissions?.includes(permission)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
