// components/Header.tsx			헤더
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/hooks/useAuth";
import { useMe } from "../queries/useMe";

import "./Header.css";
import "../style/common/underline.css";



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
      
      <div className="headerInner">
    
        <div className="auth">  {/* 로그인 정보 */}
    
          {isLoggedIn ? (
            <>
              <span className="username">{user?.username}</span>
    
              <button
                className="logoutBtn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a class="underline" href="/signup">Signup</a>
              <a class="underline" href="/login">Login</a>
            </>
          )}
    
        </div>
        
        
      {/* 메인 메뉴 */}
      <nav className={`mainNav ${menuOpen ? "open" : ""}`}>
          
        {isLoggedIn && (
          <>
            <a class="underline" href="/monitor">Monitor</a>
            <a class="underline" href="/dashboard">Dashboard</a>
                                             
          </>
        )}
          
          
        <a class="underline" href="/home">Home</a>
        <a class="underline" href="/contact">Contact</a>
        <a class="underline" href="/about">About</a>
        <a class="underline" href="/" className="logo">Main</a>
          
        
      </nav>
        
      <button className="menuButton"
        onClick={() => setMenuOpen(!menuOpen)} > [LIST] </button>
        
    </div>
    </header>
  );
}
