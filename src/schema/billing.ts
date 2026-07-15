import { pgTable, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const creditEntryTypeEnum = pgEnum("credit_entry_type", ["topup", "usage", "refund", "bonus"]);

export const billingLedgerTable = pgTable("billing_ledger", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  type: creditEntryTypeEnum("type").notNull(),
  description: text("description").notNull(),
  balance: integer("balance").notNull(),
  txHash: text("tx_hash"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBillingEntrySchema = createInsertSchema(billingLedgerTable).omit({ id: true, createdAt: true });
export type InsertBillingEntry = z.infer<typeof insertBillingEntrySchema>;
export type BillingEntry = typeof billingLedgerTable.$inferSelect;
