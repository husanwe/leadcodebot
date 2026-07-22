import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { getEnv } from "./util.ts";

const sql = neon(getEnv("DATABASE_URL"));

export const db = drizzle({ client: sql });
export const kv = await Deno.openKv();
