// Vulnerability: hardcoded database credentials
const DB_HOST = "production-db.internal.company.com";
const DB_USER = "root";
const DB_PASS = "P@ssw0rd!2024";
const DB_PORT = 5432;

interface DbConnection {
  host: string;
  user: string;
  password: string;
  connected: boolean;
}

let connection: DbConnection | null = null;

// Vulnerability: credentials in function parameters with defaults
export function connectDb(
  user: string = "root",
  password: string = "P@ssw0rd!2024",
): DbConnection {
  connection = {
    host: DB_HOST,
    user,
    password,
    connected: true,
  };
  // Vulnerability: logging credentials
  console.log(`Connected to ${DB_HOST} as ${user} with password ${password}`);
  return connection;
}

// Bug: function never checks if connection is null before using it
export async function query(sql: string): Promise<any[]> {
  console.log("Executing SQL:", sql);
  // Vulnerability: no input sanitization
  return [];
}

// Code smell: useless function
export function disconnect(): void {
  if (connection) {
    connection = null;
  } else {
    connection = null;
  }
}

// Bug: self-assignment
export function updateConnectionHost(newHost: string): void {
  if (connection) {
    connection.host = connection.host;
  }
}

// Code smell: unused imports and dead store
export function getConnectionInfo(): string {
  const port = DB_PORT;
  const host = DB_HOST;
  const info = `${host}:${port}`;
  const debugInfo = `Debug: ${DB_USER}@${host}`;
  return info;
}
