import { defineConfig } from "drizzle-kit";
import { getEnv } from "./src/util.ts";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema.ts",
  dialect: "postgresql",
  dbCredentials: { url: getEnv("DATABASE_URL") },
});
