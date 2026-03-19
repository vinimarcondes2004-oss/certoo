import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const siteDataTable = pgTable("site_data", {
  id: text("id").primaryKey().default("main"),
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type SiteDataRow = typeof siteDataTable.$inferSelect;
