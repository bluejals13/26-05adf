import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import { validateLogin } from "../utils/validateAuth";
import { useAuth } from "../components/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    const error = validateLogin(username, password);

    if (error) {
      setErrorMessage(error);
      return;
    }

    try {
      setErrorMessage("");

      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErrorMessage(data?.message || "로그인에 실패했습니다.");
        return;
      }

      const token = await res.text();

      // 🔥 핵심: AuthContext 통해서만 상태 관리
      login(token, username);

      navigate("/main");
    } catch (err) {
      console.error(err);
      setErrorMessage("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <h2>로그인</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <br />

        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />

        {errorMessage && (
          <div style={{ color: "#ff6b6b", marginBottom: "10px" }}>
            {errorMessage}
          </div>
        )}

        <button type="submit">로그인</button>
      </form>
    </div>
  );
}
