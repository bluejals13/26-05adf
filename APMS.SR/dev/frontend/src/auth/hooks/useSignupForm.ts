// hooks/useSignupForm.ts	// 회원가입 용 폼

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../auth.service";
import { signupSchema } from "../auth.schema";

export function useSignupForm() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    const result = signupSchema.safeParse({
      username,
      password,
      email,
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

      await authService.signup?.({
        username,
        password,
        email,
      });

      navigate("/login");
    } catch (e: any) {
      setErrorMessage(
        e?.message === "DUPLICATE_USERNAME"
          ? "이미 존재하는 아이디입니다"
          : "회원가입 실패"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    username,
    password,
    email,
    setUsername,
    setPassword,
    setEmail,

    errorMessage,
    isLoading,
    handleSignup,
  };
}
