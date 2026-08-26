// components/AdminRoute.tsx			role 체크

import { Navigate, Outlet } from "react-router-dom";
import FullPageSpinner from "./loading/FullPageSpinner";
import { useAuth } from "../auth/hooks/useAuth";
import { usePermissions } from "../auth/hooks/usePermissions";


interface ProtectedRouteProps {
  permission?: string;
}

export default function AdminRoute({
  permission,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const { hasPermission } = usePermissions(user);

  if (isLoading) return <FullPageSpinner />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
