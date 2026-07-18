import { pgTable, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { projectsTable } from "./projects";
import { chatSessionsTable } from "./chat";

export const taskStatusEnum = pgEnum("task_status", ["pending", "running", "done", "failed"]);

export const tasksTable = pgTable("tasks", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  projectId: text("project_id").references(() => projectsTable.id, { onDelete: "set null" }),
  sessionId: text("session_id").references(() => chatSessionsTable.id, { onDelete: "set null" }),
  prompt: text("prompt").notNull(),
  status: taskStatusEnum("status").notNull().default("pending"),
  result: text("result"),
  onChainHash: text("on_chain_hash"), // bytes32 hex once anchored
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertTaskSchema = createInsertSchema(tasksTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasksTable.$inferSelect;
