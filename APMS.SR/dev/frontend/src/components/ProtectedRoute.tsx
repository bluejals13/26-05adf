// components/ProtectedRoute.tsx			로그인 체크

import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";



export default function ProtectedRoute() {
  //const token = useAuthStore((s) => s.token);
  const { token } = useAuthStore();
  if (token === undefined) return null; // bootstrap 대기
  if (!token) return <Navigate to="/login" replace />;
  
  return <Outlet />;
}
