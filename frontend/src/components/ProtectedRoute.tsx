import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute() {
  const { token } = useAuth();
  const location = useLocation();

  // 🔥 핵심: 아직 auth 판단 중이면 아무것도 안 그림
 // if (loading) return null;

  // 로그인 안 되어 있으면 로그인 페이지로
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}
