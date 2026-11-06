"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api, User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: "ROLE_ADMIN" | "ROLE_FARMER" | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  switchAccount: (email: string, password?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("agrishare_token");
    const savedUser = localStorage.getItem("agrishare_user");

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("agrishare_token");
        localStorage.removeItem("agrishare_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.login({ email, password });
      const userData: User = {
        id: res.id,
        name: res.name,
        email: res.email,
        role: res.role,
        phone: res.phone,
        address: res.address,
        latitude: res.latitude,
        longitude: res.longitude,
        avatarUrl: res.avatarUrl,
      };

      setToken(res.token);
      setUser(userData);
      localStorage.setItem("agrishare_token", res.token);
      localStorage.setItem("agrishare_user", JSON.stringify(userData));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.auth.register(data);
      const userData: User = {
        id: res.id,
        name: res.name,
        email: res.email,
        role: res.role,
        phone: res.phone,
        address: res.address,
        latitude: res.latitude,
        longitude: res.longitude,
        avatarUrl: res.avatarUrl,
      };

      setToken(res.token);
      setUser(userData);
      localStorage.setItem("agrishare_token", res.token);
      localStorage.setItem("agrishare_user", JSON.stringify(userData));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("agrishare_token");
    localStorage.removeItem("agrishare_user");
  };

  const switchAccount = async (email: string, password?: string) => {
    if (!password) {
      throw new Error("Password is required to authenticate.");
    }
    await login(email, password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isLoading,
        login,
        register,
        logout,
        switchAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
