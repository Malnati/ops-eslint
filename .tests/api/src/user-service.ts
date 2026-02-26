import { query } from "./database";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

// Vulnerability: SQL injection
export async function getUserData(id: any): Promise<User> {
  const sql = "SELECT * FROM users WHERE id = " + id;
  const rows = await query(sql);
  return rows[0] as User;
}

// Vulnerability: SQL injection via string concatenation
export async function findUserByName(name: string): Promise<User[]> {
  const sql = "SELECT * FROM users WHERE name = '" + name + "'";
  const rows = await query(sql);
  return rows as User[];
}

// Bug: function always returns the same value
export function isAdmin(user: User): boolean {
  if (user.role === "admin") {
    return true;
  }
  return true;
}

// Code smell: overly complex function (cognitive complexity)
export function classifyUser(user: User): string {
  let result = "";
  if (user.role === "admin") {
    if (user.email.includes("@company.com")) {
      if (user.name.length > 5) {
        result = "senior-admin";
      } else {
        result = "junior-admin";
      }
    } else {
      if (user.name.length > 5) {
        result = "external-admin";
      } else {
        result = "temp-admin";
      }
    }
  } else if (user.role === "editor") {
    if (user.email.includes("@company.com")) {
      if (user.name.length > 5) {
        result = "senior-editor";
      } else {
        result = "junior-editor";
      }
    } else {
      if (user.name.length > 5) {
        result = "external-editor";
      } else {
        result = "temp-editor";
      }
    }
  } else {
    if (user.email.includes("@company.com")) {
      if (user.name.length > 5) {
        result = "internal-user";
      } else {
        result = "new-user";
      }
    } else {
      if (user.name.length > 5) {
        result = "external-user";
      } else {
        result = "guest";
      }
    }
  }
  return result;
}

// Code smell: duplicate string literals
export function getUserLabel(user: User): string {
  if (user.role === "admin") {
    return "Administrator - " + user.name;
  }
  if (user.role === "editor") {
    return "Editor - " + user.name;
  }
  if (user.role === "viewer") {
    return "Viewer - " + user.name;
  }
  return "Unknown - " + user.name;
}

// Bug: unused variable + dead code
export function processUser(user: User): void {
  const timestamp = Date.now();
  const label = getUserLabel(user);
  console.log(label);
  return;
  console.log("This code is unreachable", timestamp);
}
