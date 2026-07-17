import {
  bigint,
  pgTable,
  smallint,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: bigint({ mode: "number" }).primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
});

export const profilesTable = pgTable("profiles", {
  id: smallint().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 30 }).notNull().unique(),
  userId: bigint("user_id", { mode: "number" }).notNull().unique()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
});
