import { pgTable, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { projectsTable } from "./projects";

export const chatMessageRoleEnum = pgEnum("chat_message_role", ["user", "assistant", "system"]);

// ── chat_sessions ─────────────────────────────────────────────────────────────

export const chatSessionsTable = pgTable("chat_sessions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  projectId: text("project_id").references(() => projectsTable.id, { onDelete: "set null" }),
  title: text("title").notNull().default("New Chat"),
  model: text("model").notNull().default("claude-3-5-sonnet-20241022"),
  messageCount: integer("message_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertChatSessionSchema = createInsertSchema(chatSessionsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatSession = typeof chatSessionsTable.$inferSelect;

// ── chat_messages ─────────────────────────────────────────────────────────────

export const chatMessagesTable = pgTable("chat_messages", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  sessionId: text("session_id").notNull().references(() => chatSessionsTable.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  projectId: text("project_id").references(() => projectsTable.id, { onDelete: "set null" }),
  role: chatMessageRoleEnum("role").notNull(),
  content: text("content").notNull(),
  model: text("model"),            // set on assistant messages
  tokensUsed: integer("tokens_used"),
  creditsUsed: integer("credits_used"),   // cSPRINK deducted for this message
  spendTxHash: text("spend_tx_hash"),     // on-chain spend tx proof
  onChainHash: text("on_chain_hash"),     // keccak256 content anchor
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessagesTable).omit({ id: true, createdAt: true });
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessagesTable.$inferSelect;
