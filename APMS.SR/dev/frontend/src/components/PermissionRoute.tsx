// components/PermissionRoute.tsx		permission 체크

import { Navigate, Outlet } from "react-router-dom";
import FullPageSpinner from "../components/FullPageSpinner";
import { useAuth } from "../auth/hooks/useAuth";
import { usePermissions } from "../auth/usePermissions";

export function PermissionRoute({ permission }: { permission: Permission }) {
  const { user } = useAuth();
  const { user, isLoading } = useAuth();

  if (isLoading) return <FullPageSpinner />;

  if (!user) return <Navigate to="/login" />;

  if (!user.permissions.includes(permission)) { return <Navigate to="/" />; }

  return <Outlet />;
}