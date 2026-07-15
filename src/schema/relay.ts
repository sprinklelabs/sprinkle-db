import { pgTable, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { projectsTable } from "./projects";

export const relayStatusEnum = pgEnum("relay_status", ["pending", "running", "completed", "failed"]);

export const relayTransactionsTable = pgTable("relay_transactions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  projectId: text("project_id").references(() => projectsTable.id, { onDelete: "set null" }),
  txHash: text("tx_hash").notNull(),
  status: relayStatusEnum("status").notNull().default("pending"),
  relayNode: text("relay_node"),
  gasSponsored: text("gas_sponsored"),
  executionTimeMs: integer("execution_time_ms"),
  retryCount: integer("retry_count").notNull().default(0),
  chain: text("chain").notNull(),
  logs: text("logs").array().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertRelayTxSchema = createInsertSchema(relayTransactionsTable).omit({ id: true, createdAt: true });
export type InsertRelayTx = z.infer<typeof insertRelayTxSchema>;
export type RelayTransaction = typeof relayTransactionsTable.$inferSelect;
