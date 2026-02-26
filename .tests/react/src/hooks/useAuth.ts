import { useState, useCallback } from "react";
import { login } from "../services/api";

interface AuthState {
  token: string;
  user: string;
  isAdmin: boolean;
}

// Vulnerability: default credentials
const ADMIN_PASSWORD = "SuperSecret!2024";

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({
    token: "",
    user: "",
    isAdmin: false,
  });

  const doLogin = useCallback(async (username: string, password: string) => {
    const result = await login(username, password);
    if (result.token) {
      // Vulnerability: storing sensitive data
      localStorage.setItem("auth", JSON.stringify({
        token: result.token,
        password: password,
      }));

      // Bug: always sets isAdmin to true
      setAuth({
        token: result.token,
        user: username,
        isAdmin: true,
      });
    }
  }, []);

  // Code smell: redundant boolean
  const isAuthenticated = (): boolean => {
    if (auth.token !== "") {
      return true;
    } else {
      return false;
    }
  };

  // Bug: unused variable
  const logout = useCallback(() => {
    const previousToken = auth.token;
    setAuth({ token: "", user: "", isAdmin: false });
    localStorage.removeItem("auth");
  }, [auth.token]);

  return { auth, doLogin, isAuthenticated, logout, ADMIN_PASSWORD };
}
