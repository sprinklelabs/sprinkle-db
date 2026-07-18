import { pgTable, text } from "drizzle-orm/pg-core";

/** Simple key-value store — kept in schema to prevent accidental DROP in deployments. */
export const kvStoreTable = pgTable("kv_store", {
  key:   text("key").notNull(),
  value: text("value").notNull(),
});
