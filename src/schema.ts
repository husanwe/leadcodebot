import {
  bigint,
  pgTable,
  smallint,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull().$onUpdate(() => new Date()),
};

export const usersTable = pgTable("users", {
  id: bigint({ mode: "number" }).primaryKey(),
  ...timestamps,
});

export const profilesTable = pgTable("profiles", {
  id: smallint().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 30 }).notNull().unique(),
  userId: bigint("user_id", { mode: "number" }).notNull().unique()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  ...timestamps,
});
