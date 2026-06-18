// auth.schema.ts							// 로그인 / 회원가입 규칙 스키마

import { z } from "zod";

// 로그인 / 회원가입 공통 input
export const authBaseSchema = z.object({
  username: z.string().trim().min(2, "아이디는 2자 이상"),
  password: z.string().trim().min(3, "비밀번호는 3자 이상"),
});

// login은 그대로
export const loginSchema = authBaseSchema;

// signup만 확장
export const signupSchema = authBaseSchema.extend({
  email: z.string().email("이메일 형식이 아닙니다"),
});
