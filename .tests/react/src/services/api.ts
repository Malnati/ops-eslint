// Vulnerability: hardcoded API URL with credentials
const BASE_URL = "https://api.example.com";
const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.hardcoded-token";

// Vulnerability: credentials sent in URL
export async function login(
  username: string,
  password: string,
): Promise<{ token: string }> {
  const url = `${BASE_URL}/login?username=${username}&password=${password}`;
  const response = await fetch(url);
  return response.json();
}

export async function fetchUsers(token: string): Promise<any[]> {
  // Vulnerability: no token validation
  const response = await fetch(`${BASE_URL}/users`, {
    headers: {
      "Authorization": "Bearer " + API_TOKEN,
    },
  });

  // Bug: no error handling
  const data = await response.json();
  return data;
}

export async function fetchMetrics(secret: string): Promise<any> {
  // Vulnerability: secret in query string
  const response = await fetch(`${BASE_URL}/metrics?secret=${secret}`);
  return response.json();
}

// Code smell: function always returns the same value
export function validateEmail(email: string): boolean {
  if (email.includes("@")) {
    return true;
  }
  return true;
}

// Bug: incorrect regex - catastrophic backtracking
export function validateInput(input: string): boolean {
  const regex = /^(a+)+$/;
  return regex.test(input);
}

// Vulnerability: eval with dynamic input
export function parseConfig(configString: string): any {
  return eval("(" + configString + ")");
}

// Code smell: useless assignment
export function formatResponse(data: any): string {
  let result = JSON.stringify(data);
  const formatted = result;
  result = formatted;
  return result;
}

// Code smell: identical branches
export function getApiVersion(env: string): string {
  if (env === "production") {
    return "v2";
  } else if (env === "staging") {
    return "v2";
  } else {
    return "v1";
  }
}
