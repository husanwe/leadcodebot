import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { getEnv } from "./util.ts";

const databaseUrl = getEnv("DATABASE_URL");
const sql = neon(databaseUrl);
export const db = drizzle({ client: sql });
