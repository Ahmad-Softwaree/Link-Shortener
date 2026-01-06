import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let dbInstance: ReturnType<typeof drizzle> | null = null;

function initializeDatabase() {
  if (dbInstance) {
    return dbInstance;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not defined in environment variables. Please add it to your .env file."
    );
  }

  const sql = neon(process.env.DATABASE_URL);
  dbInstance = drizzle(sql, { schema });
  return dbInstance;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    const database = initializeDatabase();
    return (database as any)[prop];
  },
});

export default db;
