// components/PermissionRoute.tsx		permission 체크

import { Navigate, Outlet } from "react-router-dom";
import FullPageSpinner from "./loading/FullPageSpinner";
import { useMe } from "../queries/useMe";

export function PermissionRoute({ permission }: { permission: string }) {
  const { data: user, isLoading } = useMe();

  if (isLoading) return <FullPageSpinner />;
  if (!user) return <Navigate to="/login" />;

  if (!user.permissions?.includes(permission)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
