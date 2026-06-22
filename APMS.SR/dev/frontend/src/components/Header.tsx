// components/Header.tsx			헤더
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/hooks/useAuth";
import { useMe } from "../queries/useMe";
//import type { User } from "../auth/auth.types";




export default function Header() {
  const navigate = useNavigate();
  const { user, logout, isLoggedIn } = useAuth();
  const { isStale, fetchStatus, dataUpdatedAt } = useMe();
  
  useEffect(() => {
    console.log("AUTH STATE", {
      user,
      isLoggedIn,
    });
  }, [user, isLoggedIn]);
  
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
              {user?.username ?? ""}
            </span>
            
            <div style={{ fontSize: 12, marginLeft: 20, color: "gray" }}>
              <div>stale: {String(isStale)}</div>
              <div>fetch: {fetchStatus}</div>
              <div>
                updated: {new Date(dataUpdatedAt).toLocaleTimeString()}
              </div>
            </div>

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
