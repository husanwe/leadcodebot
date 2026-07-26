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

export const users = pgTable("users", {
  id: bigint({ mode: "number" }).primaryKey(),
  locale: varchar({ length: 2 }).notNull().default("en"),
  ...timestamps,
});

export const profiles = pgTable("profiles", {
  id: smallint().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 30 }).notNull().unique(),
  userId: bigint("user_id", { mode: "number" }).notNull().unique()
    .references(() => users.id, { onDelete: "cascade" }),
  ...timestamps,
});
