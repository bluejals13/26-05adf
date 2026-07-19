// components/AdminRoute.tsx			role 체크

import { Navigate, Outlet } from "react-router-dom";
import FullPageSpinner from "./loading/FullPageSpinner";
import { useMe } from "../queries/useMe";
import { usePermissions } from "../auth/hooks/usePermissions";

interface ProtectedRouteProps {
  role?: string;
  permission?: string;
}

export default function ProtectedRoute({
  role,
  permission,
}: ProtectedRouteProps) {
  const { data: me, isLoading } = useMe();
  const { hasRole, hasPermission } = usePermissions(me);

  if (isLoading) return <FullPageSpinner />;

  if (!me) {
    return <Navigate to="/login" replace />;
  }

  if (role && !hasRole(role)) {
    return <Navigate to="/403" replace />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
