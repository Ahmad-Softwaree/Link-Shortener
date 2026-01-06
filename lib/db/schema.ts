import {
  pgTable,
  text,
  timestamp,
  serial,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const links = pgTable(
  "links",
  {
    id: serial("id").primaryKey(),
    shortCode: text("short_code").notNull(),
    originalUrl: text("original_url").notNull(),
    userId: text("user_id").notNull(),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    shortCodeIdx: uniqueIndex("short_code_idx").on(table.shortCode),
  })
);

export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
