export const validateSignup = (username: string, password: string): string | null => {
  if (!username) return "아이디를 입력하세요";
  if (username.length < 2) return "아이디는 2자 이상";

  if (!password) return "비밀번호를 입력하세요";
  if (password.length < 3) return "비밀번호는 3자 이상";

  return null;
};
