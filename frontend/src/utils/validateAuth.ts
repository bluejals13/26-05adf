const validateAuthBase = (username: string, password: string) => {
  if (!username) return "아이디를 입력하세요";
  if (username.length < 2) return "아이디는 2자 이상";

  if (!password) return "비밀번호를 입력하세요";
  if (password.length < 3) return "비밀번호는 3자 이상";

  return null;
};

// 로그인은 그대로 공통 사용
export const validateLogin = validateAuthBase;

// 회원가입은 확장 가능 구조
export const validateSignup = (u: string, p: string) => {
  const base = validateAuthBase(u, p);
  if (base) return base;

  // signup 전용 규칙
  return null;
};
