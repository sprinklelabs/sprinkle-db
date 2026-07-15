import { pgTable, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { projectsTable } from "./projects";

export const aiRequestTypeEnum = pgEnum("ai_request_type", ["chat", "image", "speech", "vision"]);
export const aiRequestStatusEnum = pgEnum("ai_request_status", ["success", "error"]);

export const aiRequestsTable = pgTable("ai_requests", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  projectId: text("project_id").references(() => projectsTable.id, { onDelete: "set null" }),
  type: aiRequestTypeEnum("type").notNull(),
  model: text("model").notNull(),
  status: aiRequestStatusEnum("status").notNull().default("success"),
  promptTokens: integer("prompt_tokens"),
  completionTokens: integer("completion_tokens"),
  durationMs: integer("duration_ms"),
  creditsUsed: integer("credits_used").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAiRequestSchema = createInsertSchema(aiRequestsTable).omit({ id: true, createdAt: true });
export type InsertAiRequest = z.infer<typeof insertAiRequestSchema>;
export type AiRequest = typeof aiRequestsTable.$inferSelect;
