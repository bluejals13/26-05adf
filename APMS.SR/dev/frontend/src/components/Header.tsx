// components/Header.tsx			헤더

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/hooks/useAuth";

//import type { User } from "../auth/auth.types";


export default function Header() {
  const navigate = useNavigate();
  const { user, logout, isLoggedIn } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
      <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Link to="/">Main</Link>
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>

        {!isLoggedIn && <Link to="/signup">Signup</Link>}

        {isLoggedIn ? (
          <>
            <Link to="/monitor">Monitor</Link>
            <Link to="/dashboard">Dashboard</Link>

            <span style={{ marginLeft: "auto" }}>
              {user?.username}님
            </span>

            <button onClick={handleLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}
