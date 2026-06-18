// pages/Signup.tsx

import { useSignupForm } from "../auth/hooks/useSignupForm";

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

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
        />

        {errorMessage && <p>{errorMessage}</p>}

        <button disabled={isLoading}>
          {isLoading ? "가입 중..." : "회원가입"}
        </button>
      </form>
    </div>
  );
}