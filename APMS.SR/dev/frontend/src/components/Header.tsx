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
    <header className="header">
      <div className="topBar">
        
        <button
          className="menuButton"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>
        
      <nav className={`nav ${menuOpen ? "open" : ""}`}>
        <div className="navLinks">
          <Link to="/" className="logo">Main</Link>
          <Link to="/home">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          
        </div>
        
        <div className="navLinks">
        {isLoggedIn && (
          <>
            <Link to="/monitor">Monitor</Link>
            <Link to="/dashboard">Dashboard</Link>
                                           
          </>
        )}
          
        </div>
        
        <div className="navUser">
          
          {isLoggedIn ? (
            <>
              <span> {user?.username} </span>
            
            <div style={{ fontSize: 12, marginLeft: 20, color: "gray" }}>
              <div>token: {token ? "YES" : "NO"}</div>
              <div>loggedIn: {String(!!token && !!user)}</div>
              <div>loading: {String(isLoading)}</div>
              <div>error: {String(isError)}</div>
            </div>

            <button onClick={handleLogout}> Logout </button>
          </>
        ) : (
          <>
            <Link to="/signup">Signup</Link>
            <Link to="/login">Login</Link>
          </>
          )}
        </div>
      </nav>
    </header>
  );
}
