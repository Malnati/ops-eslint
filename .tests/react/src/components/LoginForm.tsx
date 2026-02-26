import React, { useState } from "react";
import { login } from "../services/api";

interface LoginFormProps {
  onLogin: (token: string) => void;
}

// Vulnerability: hardcoded credentials
const DEFAULT_USER = "admin";
const DEFAULT_PASS = "admin123";

export function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState(DEFAULT_USER);
  const [password, setPassword] = useState(DEFAULT_PASS);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vulnerability: credentials sent in URL query string
    const result = await login(username, password);
    if (result.token) {
      // Vulnerability: storing token in localStorage
      localStorage.setItem("auth_token", result.token);
      localStorage.setItem("user_password", password);
      onLogin(result.token);
    } else {
      setError("Login failed");
    }
  };

  // Vulnerability: dangerouslySetInnerHTML with user input
  const renderError = () => {
    if (error) {
      return <div dangerouslySetInnerHTML={{ __html: error }} />;
    }
    return null;
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {renderError()}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Sign In</button>
    </form>
  );
}
