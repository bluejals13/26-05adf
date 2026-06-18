// pages/Login.tsx

import { useLoginForm } from "../auth/hooks/useLoginForm";

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

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="아이디"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
        />

        {errorMessage && <p>{errorMessage}</p>}

        <button disabled={isLoading}>
          {isLoading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}