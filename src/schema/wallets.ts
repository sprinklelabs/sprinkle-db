import { pgTable, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { projectsTable } from "./projects";

export const walletTypeEnum = pgEnum("wallet_type", ["embedded", "smart"]);
export const walletStatusEnum = pgEnum("wallet_status", ["active", "inactive"]);

export const walletsTable = pgTable("wallets", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  projectId: text("project_id").references(() => projectsTable.id, { onDelete: "set null" }),
  address: text("address").notNull(),
  type: walletTypeEnum("type").notNull(),
  chain: text("chain").notNull(),
  status: walletStatusEnum("status").notNull().default("active"),
  balance: text("balance"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const walletTxTypeEnum = pgEnum("wallet_tx_type", ["transfer", "mint", "burn", "contract_call"]);
export const walletTxStatusEnum = pgEnum("wallet_tx_status", ["pending", "confirmed", "failed"]);

export const walletTransactionsTable = pgTable("wallet_transactions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  walletId: text("wallet_id").notNull().references(() => walletsTable.id, { onDelete: "cascade" }),
  hash: text("hash").notNull(),
  type: walletTxTypeEnum("type").notNull(),
  status: walletTxStatusEnum("status").notNull().default("pending"),
  value: text("value").notNull(),
  toAddress: text("to_address"),
  gasUsed: text("gas_used"),
  chain: text("chain").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertWalletSchema = createInsertSchema(walletsTable).omit({ id: true, createdAt: true });
export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type Wallet = typeof walletsTable.$inferSelect;

export const insertWalletTxSchema = createInsertSchema(walletTransactionsTable).omit({ id: true, createdAt: true });
export type InsertWalletTx = z.infer<typeof insertWalletTxSchema>;
export type WalletTransaction = typeof walletTransactionsTable.$inferSelect;
