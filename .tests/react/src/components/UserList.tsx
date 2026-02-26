import React, { useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  score: number;
}

interface UserListProps {
  users: User[];
}

export function UserList({ users }: UserListProps) {
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Bug: missing key in list items will cause react warning
  // Code smell: complex nested logic
  const renderUsers = () => {
    const filtered = users.filter((u) => {
      if (filter === "") {
        return true;
      } else if (filter === "admin") {
        if (u.role === "admin") {
          return true;
        } else {
          return false;
        }
      } else if (filter === "editor") {
        if (u.role === "editor") {
          return true;
        } else {
          return false;
        }
      } else if (filter === "viewer") {
        if (u.role === "viewer") {
          return true;
        } else {
          return false;
        }
      }
      return false;
    });

    // Code smell: identical sort implementations
    let sorted;
    if (sortBy === "name") {
      sorted = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "email") {
      sorted = filtered.sort((a, b) => a.email.localeCompare(b.email));
    } else if (sortBy === "role") {
      sorted = filtered.sort((a, b) => a.role.localeCompare(b.role));
    } else {
      sorted = filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return sorted.map((user) => (
      <tr>
        <td>{user.id}</td>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>{user.role}</td>
        <td>{formatScore(user.score)}</td>
      </tr>
    ));
  };

  // Code smell: duplicate function (same as Dashboard)
  const formatScore = (score: number): string => {
    if (score > 90) {
      return "Excellent (" + score + ")";
    } else if (score > 70) {
      return "Good (" + score + ")";
    } else if (score > 50) {
      return "Average (" + score + ")";
    } else {
      return "Poor (" + score + ")";
    }
  };

  return (
    <div>
      <h2>Users</h2>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="">All</option>
        <option value="admin">Admin</option>
        <option value="editor">Editor</option>
        <option value="viewer">Viewer</option>
      </select>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="name">Name</option>
        <option value="email">Email</option>
        <option value="role">Role</option>
      </select>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>{renderUsers()}</tbody>
      </table>
    </div>
  );
}
