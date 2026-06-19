// components/PermissionRoute.tsx		permission 체크

import { Navigate, Outlet } from "react-router-dom";
import FullPageSpinner from "../../components/loading/FullPageSpinner";
import { useAuth } from "../auth/hooks/useAuth";

import type { Permission } from "../auth/auth.types";
import { usePermissions } from "../auth/hooks/usePermissions";


export function PermissionRoute({ permission }: { permission: Permission }) {
  const { user } = useAuth();
  const { user, isLoading } = useAuth();

  if (isLoading) return <FullPageSpinner />;

  if (!user) return <Navigate to="/login" />;

  if (!user.permissions.includes(permission)) { return <Navigate to="/" />; }

  return <Outlet />;
}
