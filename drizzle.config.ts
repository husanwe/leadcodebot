import { defineConfig } from "drizzle-kit";

const databaseUrl = Deno.env.get("DATABASE_URL");
if (databaseUrl === undefined) {
  console.error("DATABASE_URL is not provided!");
  Deno.exit(1);
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema.ts",
  dialect: "postgresql",
  dbCredentials: { url: databaseUrl },
});
