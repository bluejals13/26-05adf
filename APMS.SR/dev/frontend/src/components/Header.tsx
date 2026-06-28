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
      
      <div className="navUser">
        
      
          {isLoggedIn ? (
            <>
              <span> {user?.username} </span>            
              <button onClick={handleLogout}> Logout </button>  
          </>
        ) : (
          <>
            <nav className="navUser">
              <Link to="/signup">Signup</Link>
              <Link to="/login">Login</Link>
            </nav>
          </>
          )}
        
        
        
        <button className="menuButton"
          onClick={() => setMenuOpen(!menuOpen)} > [LIST] </button>
        
        
        
      {/* 메인 메뉴 */}
      <nav className={`nav ${menuOpen ? "open" : ""}`}>

          
        {isLoggedIn && (
          <>
            <Link to="/monitor">Monitor</Link>
            <Link to="/dashboard">Dashboard</Link>
                                             
          </>
        )}
          
          
        <Link to="/home">Home</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/about">About</Link>
        <Link to="/" className="logo">Main</Link>
          
        
      </nav>
        
    </div>
    </header>
  );
}
