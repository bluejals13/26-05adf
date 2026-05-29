import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { token, username, logout } = useAuth();

  return (
    <header style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
      <nav style={{ display: "flex", gap: 12 }}>
        <Link to="/main">Main</Link>
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>

        {!token && <Link to="/signup">Signup</Link>}

        {token ? (
          <>
            <Link to="/monitor">Monitor</Link>
            <Link to="/dashboard">Dashboard</Link>

            <span style={{ marginLeft: "auto" }}>{username}님</span>

            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
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
