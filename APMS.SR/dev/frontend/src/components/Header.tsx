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
              <Link class="underline" to="/signup">Signup</Link>
              <Link class="underline" to="/login">Login</Link>
            </>
          )}
    
        </div>
        
        
      {/* 메인 메뉴 */}
      <nav className={`mainNav ${menuOpen ? "open" : ""}`}>
          
        {isLoggedIn && (
          <>
            <Link class="underline" to="/monitor">Monitor</Link>
            <Link class="underline" to="/dashboard">Dashboard</Link>
                                             
          </>
        )}
          
          
        <Link class="underline" to="/home">Home</Link>
        <Link class="underline" to="/contact">Contact</Link>
        <Link class="underline" to="/about">About</a>
        <Link class="underline" to="/" className="logo">Main</Link>
          
        
      </nav>
        
      <button className="menuButton"
        onClick={() => setMenuOpen(!menuOpen)} > [LIST] </button>
        
    </div>
    </header>
  );
}
