// auth/hooks/useLoginForm.ts

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { authService } from "../auth.service";
import { loginSchema } from "../auth.schema";
import { useAuthStore } from "../../store/auth.store";
import { HttpError } from "../../api/http";

export function useLoginForm() {
  const navigate = useNavigate();

  const authServiceUnavailable = useAuthStore(
    (s) => s.authServiceUnavailable,
  );

  const setAuthServiceUnavailable = useAuthStore(
    (s) => s.setAuthServiceUnavailable,
  );

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
        "입력값 오류",
      );

      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      await authService.login(username, password);

      setAuthServiceUnavailable(false);

      navigate("/");

    } catch (e: unknown) {
      // 인증 인프라 장애
      if (
        e instanceof HttpError &&
        e.status === 503
      ) {
        setAuthServiceUnavailable(true);

        setErrorMessage(
          "인증 서비스가 일시적으로 unavailable 상태입니다. 잠시 후 다시 시도해주세요.",
        );

        return;
      }

      // Network / Timeout
      if (
        e instanceof TypeError ||
        (e instanceof Error &&
          e.message === "Authentication service timeout")
      ) {
        setAuthServiceUnavailable(true);

        setErrorMessage(
          "인증 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
        );

        return;
      }

      const error = e as { message?: string };

      setErrorMessage(
        error.message === "INVALID_CREDENTIALS"
          ? "아이디 또는 비밀번호가 틀렸습니다"
          : "로그인 실패",
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

    authServiceUnavailable,

    handleLogin,
  };
}
