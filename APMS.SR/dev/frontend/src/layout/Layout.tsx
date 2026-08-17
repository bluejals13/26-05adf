import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { useAuthStore } from "../store/auth.store";

export default function Layout() {
  const authServiceUnavailable = useAuthStore(
    (state) => state.authServiceUnavailable
  );

  return (
    <div>
      <Header />

      {authServiceUnavailable && (
        <div className="system-alert">
          인증 서비스에 일시적인 장애가 발생했습니다.
          일부 인증 기능이 제한될 수 있습니다.
          복구 후 자동으로 정상화됩니다.
        </div>
      )}

      <main style={{ padding: 12 }}>
        <Outlet />
      </main>
    </div>
  );
}
