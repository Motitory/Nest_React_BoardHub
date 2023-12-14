// UserContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { getUserInfo } from "../api";

interface User {
  id: number;
  nickname: string;
  // 다른 사용자 속성들...
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      getUserInfo(accessToken)
        .then((userInfo) => {
          setUser(userInfo);
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
          // 옵션: 인증 실패 시 토큰을 삭제하고 로그인 페이지로 리다이렉트
        });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
