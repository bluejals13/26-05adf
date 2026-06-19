// components/AdminRoute.tsx			role 체크

import { Navigate, Outlet } from "react-router-dom";
import FullPageSpinner from "./loading/FullPageSpinner";
import { useMe } from "../queries/useMe";
import { usePermissions } from "../auth/hooks/usePermissions";

export default function AdminRoute({ permission }: { permission?: string }) {
  const { data: me, isLoading } = useMe();
  const { hasPermission, isAdmin } = usePermissions(me);

  if (isLoading) return <FullPageSpinner />;
  if (!me) return <Navigate to="/login" replace />;

  if (!isAdmin()) return <Navigate to="/403" replace />;

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
