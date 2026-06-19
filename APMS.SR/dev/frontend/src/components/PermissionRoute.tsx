// components/PermissionRoute.tsx		permission 체크

import { Navigate, Outlet } from "react-router-dom";
import FullPageSpinner from "./loading/FullPageSpinner";
import { useAuth } from "../auth/hooks/useAuth";

import type { Permission } from "../auth/auth.types";

//import type { User } from "../auth/auth.types";

export function PermissionRoute({ permission }: { permission: Permission }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <FullPageSpinner />;

  if (!user) return <Navigate to="/login" />;

  if (!user.permissions.includes(permission)) { return <Navigate to="/" />; }

  return <Outlet />;
}
