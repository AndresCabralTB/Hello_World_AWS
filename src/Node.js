import mysql from "mysql2/promise";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const REGION = process.env.AWS_REGION || "us-east-1";
const SECRET_ID = process.env.DB_SECRET_ID || "test/secretmanager/key";

const sm = new SecretsManagerClient({ region: REGION });
const res = await sm.send(new GetSecretValueCommand({ SecretId: SECRET_ID }));

if (!res.SecretString) {
  throw new Error("SecretString is empty (binary secrets not supported in this example).");
}

let secret;
try {
  secret = JSON.parse(res.SecretString);
} catch (e) {
  console.error("Failed to parse SecretString as JSON:", e);
  process.exit(1);
}

// Prefer secret values; fall back to envs; then to defaults
const host = secret.host ?? process.env.DB_HOST ?? "first-database-test-1.ccta2ec4yvaj.us-east-1.rds.amazonaws.com";
const port = Number(secret.port ?? process.env.DB_PORT ?? 3306);
const user = secret.username ?? process.env.DB_USER ?? "admin";
const database = secret.dbname ?? process.env.DB_NAME ?? "new_schema";
const password = secret.password ?? process.env.DB_PASSWORD; // don't hard-code in code

console.log("Connecting to MySQL with:", { host, port, user, database, password: password ? "****" : "(empty)" });

try {
  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
    database,
    connectTimeout: 10000,
    // If your instance requires TLS (require_secure_transport=ON), uncomment:
    // ssl: { rejectUnauthorized: true } // or provide Amazon RDS CA if needed
  });
  console.log("Connected to MySQL!");
  await connection.end();
} catch (error) {
  console.error("Error connecting to MySQL:", error);
}
