import { createContext, useContext, useState } from "react";

type AuthContextType = {
  token: string | null;
  username: string | null;
  isLoggedIn: boolean;
  login: (token: string, username: string) => void;
  logout: () => void;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {

  const [token, setToken] = useState<string | null>(() => {  // localStorage lazy init
    return localStorage.getItem("token");
  });

  const [username, setUsername] = useState<string | null>(() => {
    return localStorage.getItem("username");
  });

  const login = (token: string, username: string) => {  // 로그인 localStorage 동기화
    setToken(token);
    setUsername(username);

    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
  };

  const logout = () => {  // 로그아웃 localStorage 동기화
    setToken(null);
    setUsername(null);

    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        isLoggedIn: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export const useAuth = () => {  // useAuth 오류 시
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthProvider 필요");
  return ctx;
};
