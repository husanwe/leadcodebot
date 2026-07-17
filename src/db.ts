import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const databaseUrl = Deno.env.get("DATABASE_URL");
if (databaseUrl === undefined) {
  console.error("DATABASE_URL is not provided!");
  Deno.exit(1);
}

const sql = neon(databaseUrl);
export const db = drizzle({ client: sql });
