import { Outlet, Link } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      
      <main className="auth-content">
        <Outlet />
      </main>

    </div>
  );
}
