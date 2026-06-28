// components/Header.tsx			헤더
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/hooks/useAuth";
import { useMe } from "../queries/useMe";

import "./Header.css";




export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { token, logout, isLoggedIn } = useAuth();
  const { data: user, isLoading, isError } = useMe();
  
  useEffect(() => {
    console.log("AUTH DEBUG", {
      token,
      isLoggedIn: !!token && !!user,
      isLoading,
      isError,
    });
  }, [token, isLoading, isError]);
  
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
      <div className="topBar">
        <Link to="/">Main</Link>
    
        <button
          className="menuButton"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>
      <nav className={`nav ${menuOpen ? "open" : ""}`}>
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>

        {!isLoggedIn && <Link to="/signup">Signup</Link>}

        {isLoggedIn ? (
          <>
            <Link to="/monitor">Monitor</Link>
            <Link to="/dashboard">Dashboard</Link>

            <span> {user?.username} </span>
            
            <div style={{ fontSize: 12, marginLeft: 20, color: "gray" }}>
              <div>token: {token ? "YES" : "NO"}</div>
              <div>loggedIn: {String(!!token && !!user)}</div>
              <div>loading: {String(isLoading)}</div>
              <div>error: {String(isError)}</div>
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
