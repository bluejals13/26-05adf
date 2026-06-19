// pages/Login.tsx

import { useLoginForm } from "../auth/hooks/useLoginForm";

import "./Auth.css";

export default function Login() {
  const {
    username,
    password,
    setUsername,
    setPassword,
    errorMessage,
    isLoading,
    handleLogin,
  } = useLoginForm();

  return (
    <div className="auth-container">
      <form
        className="auth-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <h2>로그인</h2>

        <div className="form-group">
          <label>아이디</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {errorMessage && (
          <p className="error-message">{errorMessage}</p>
        )}

        <button disabled={isLoading}>
          {isLoading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
