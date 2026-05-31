import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import { validateSignup } from "../utils/validateAuth";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    const error = validateSignup(username, password);

    if (error) {
      setErrorMessage(error);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(""); // 기존 에러 초기화

      const res = await apiFetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      let data = null;

      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        setErrorMessage(data?.message || "회원가입 실패");
        return;
      }

      // 성공은 메시지 없이 이동 (원하면 success state 따로 가능)
      navigate("/login");
    } catch (err) {
      console.error(err);
 	  	 setErrorMessage("서버 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignup();
  };

  return (
    <div>
      <h2>회원가입</h2>

      <form onSubmit={onSubmit}>
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

        {/* ✅ 빨간 에러 메시지 영역 */}
        {errorMessage && (
          <div style={{ color: "#ff6b6b", marginBottom: "10px" }}>
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: loading ? "#ccc" : "#4caf50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "가입 중..." : "회원가입"}
        </button>

	<h4>아이디 2글자 이상, 비밀번호 3자 이상</h4>
      </form>
    </div>
  );
}
