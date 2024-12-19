"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  email2: string;
  setEmail2: (email2: string) => void;
  password2: string;
  setPassword2: (password: string) => void;
  role: string | null;
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
  const [role, setRole] = useState<string | null>(null);
  const [currentId, setCurrentId] = useState<string>("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (storedToken) {
      setToken(storedToken);
      setCurrentId(localStorage.getItem("currentId") || "");
      setEmail2(localStorage.getItem("email2") || "");
      setPassword2(localStorage.getItem("password2") || "");
      setRole(storedRole);
    }
  }, []);

  const setTokenAndStore = (newToken: string | null) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
  };

  const setEmail2AndStore = (newEmail2: string) => {
    setEmail2(newEmail2);
    localStorage.setItem("email2", newEmail2);
  };

  const setPassword2AndStore = (newPassword2: string) => {
    setPassword2(newPassword2);
    localStorage.setItem("password2", newPassword2);
  };

  const setRoleAndStore = (newRole: string) => {
    setRole(newRole);
    localStorage.setItem("role", newRole);
  };

  const setCurrentIdAndStore = (newCurrentId: string) => {
    setCurrentId(newCurrentId);
    localStorage.setItem("currentId", newCurrentId);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken: setTokenAndStore,
        email2,
        setEmail2: setEmail2AndStore,
        password2,
        setPassword2: setPassword2AndStore,
        role,
        setRole: setRoleAndStore,
        currentId,
        setCurrentId: setCurrentIdAndStore,
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
