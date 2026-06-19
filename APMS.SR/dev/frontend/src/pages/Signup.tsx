// pages/Signup.tsx

import { useSignupForm } from "../auth/hooks/useSignupForm";

import "./Auth.css";

export default function Signup() {
  const {
    username,
    password,
    email,
    setUsername,
    setPassword,
    setEmail,
    errorMessage,
    isLoading,
    handleSignup,
  } = useSignupForm();

  return (
    <div className="auth-container">
      <form
        className="auth-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSignup();
        }}
      >
        <h2>회원가입</h2>

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
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>이메일</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        {errorMessage && (
          <p className="error-message">{errorMessage}</p>
        )}
        <p className="switch-auth">
          이미 계정이 있나요? <Link to="/login">로그인</Link>
        </p>

        {errorMessage && <p>{errorMessage}</p>}

        <button disabled={isLoading}>
          {isLoading ? "가입 중..." : "회원가입"}
        </button>
      </form>
    </div>
  );
}
