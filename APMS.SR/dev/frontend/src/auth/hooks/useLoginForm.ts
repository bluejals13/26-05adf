// hooks/useLoginForm.ts	// 로그인폼 훅

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../auth.service";
import { loginSchema } from "../auth.schema";

export function useLoginForm() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    const result = loginSchema.safeParse({
      username,
      password,
    });

    if (!result.success) {
        const errors = result.error.flatten().fieldErrors;

      setErrorMessage(
        errors.username?.[0] ??
        errors.password?.[0] ??
        "입력값 오류"
      );
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      await authService.login(username, password);

      navigate("/");
    } catch (e: unknown) {
      const error = e as { message?: string };
      setErrorMessage(
        e?.message === "INVALID_CREDENTIALS"
          ? "아이디 또는 비밀번호가 틀렸습니다"
          : "로그인 실패"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    username,
    password,
    setUsername,
    setPassword,

    errorMessage,
    isLoading,
    handleLogin,
  };
}
