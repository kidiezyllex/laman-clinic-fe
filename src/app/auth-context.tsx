"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  email2: string;
  setEmail2: (email2: string) => void;
  password2: string;
  setPassword2: (password: string) => void;
  role: string;
  setRole: (role: string) => void;
  currentId: string;
  setCurrentId: (id: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [email2, setEmail2] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [currentId, setCurrentId] = useState<string>("");
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setCurrentId(localStorage.getItem("currentId") + "");
      setEmail2(localStorage.getItem("email2") + "");
      setPassword2(localStorage.getItem("password2") + "");
      setRole(localStorage.getItem("role") + "");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        email2,
        setEmail2,
        password2,
        setPassword2,
        role,
        setRole,
        currentId,
        setCurrentId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
