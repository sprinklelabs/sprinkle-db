import { pgTable, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const planEnum = pgEnum("plan", ["free", "pro", "team", "enterprise"]);

export const usersTable = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  walletAddress: text("wallet_address").notNull().unique(), // primary identity — Robinhood Chain address (auto-generated for OAuth users)
  encryptedPrivateKey: text("encrypted_private_key"),      // AES-256-GCM encrypted; only set for OAuth-created wallets
  googleId: text("google_id").unique(),                    // Google OAuth sub
  githubId: text("github_id").unique(),                    // GitHub OAuth user id
  email: text("email"),
  name: text("name").notNull().default("Builder"),
  avatarUrl: text("avatar_url"),
  plan: planEnum("plan").notNull().default("free"),
  creditBalance: integer("credit_balance").notNull().default(1000),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
