import React, { useState, useEffect } from "react";
import { UserList } from "./components/UserList";
import { LoginForm } from "./components/LoginForm";
import { Dashboard } from "./components/Dashboard";
import { fetchUsers } from "./services/api";

// Bug: component re-renders infinitely due to missing dependency array
export function App() {
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState("login");
  const [token, setToken] = useState("");

  // Bug: missing dependency in useEffect causes infinite loop
  useEffect(() => {
    fetchUsers(token).then((data) => {
      setUsers(data);
    });
  });

  // Bug: always-true condition
  const isLoggedIn = token.length > 0 || token.length <= 0;

  // Code smell: nested ternary
  const content = page === "login"
    ? <LoginForm onLogin={setToken} />
    : page === "dashboard"
      ? <Dashboard users={users} />
      : page === "users"
        ? <UserList users={users} />
        : <div>Not found</div>;

  return (
    <div>
      <nav>
        <button onClick={() => setPage("login")}>Login</button>
        <button onClick={() => setPage("dashboard")}>Dashboard</button>
        <button onClick={() => setPage("users")}>Users</button>
      </nav>
      {isLoggedIn && <p>Logged in</p>}
      {content}
    </div>
  );
}
