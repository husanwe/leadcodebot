import { defineConfig } from "drizzle-kit";
import { getEnv } from "./src/util.ts";

const databaseUrl = getEnv("DATABASE_URL");
export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema.ts",
  dialect: "postgresql",
  dbCredentials: { url: databaseUrl },
});
