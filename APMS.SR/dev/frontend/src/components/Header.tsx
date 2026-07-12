// components/Header.tsx			헤더
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/hooks/useAuth";
import { useMe } from "../queries/useMe";

import "./Header.css";
import "../style/common/underline.css";
import Button from "../style/common/Button";


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
    
              <Button
                variant="danger"
                onClick={handleLogout}
              >
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Link className="underline" to="/signup">Signup</Link>
              <Link className="underline" to="/login">Login</Link>
            </>
          )}
    
        </div>
        
        
      {/* 메인 메뉴       #@ menuButton 은 header.css 에서 설정 */}
      <nav className={`mainNav ${menuOpen ? "open" : ""}`}>
          
        {isLoggedIn && (
          <>
            <Link className="underline" to="/monitor">Monitor</Link>
            <Link className="underline" to="/dashboard">Dashboard</Link>
                                             
          </>
        )}
          
          
        <Link className="underline" to="/home">Home</Link>
        <Link className="underline" to="/contact">Contact</Link>
        <Link className="underline" to="/about">About</Link>
        <Link className="underline" to="/">Main</Link>
          
        
      </nav>
        
        
    </div>
      <button className="menuButton" 
        onClick={() => setMenuOpen(!menuOpen)} > [LIST] </button>
    </header>
  );
}
