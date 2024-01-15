import React, { createContext, ReactNode, useState, useEffect } from "react";
import { UserType } from '../utils/types';

type AuthContextType = {
  user: UserType | null;
  updateAuthUser: (user: UserType | null) => void;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const userFromLocalStorage = window.sessionStorage.getItem('user');
    if (userFromLocalStorage) {
      setUser(JSON.parse(userFromLocalStorage));
    }
  }, []);
  const updateAuthUser = (newUser: UserType | null) => {
    setUser(newUser);
    if (newUser) {
      window.sessionStorage.setItem('user', JSON.stringify(newUser));
    } else {
      window.sessionStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, updateAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
