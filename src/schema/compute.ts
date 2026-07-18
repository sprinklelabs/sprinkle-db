import { pgTable, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { projectsTable } from "./projects";

export const computeRuntimeEnum = pgEnum("compute_runtime", ["javascript", "python"]);
export const computeStatusEnum  = pgEnum("compute_status",  ["queued", "running", "completed", "failed", "timeout"]);

export const computeJobsTable = pgTable("compute_jobs", {
  id:               text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId:           text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  projectId:        text("project_id").references(() => projectsTable.id, { onDelete: "set null" }),
  runtime:          computeRuntimeEnum("runtime").notNull(),
  code:             text("code").notNull(),
  status:           computeStatusEnum("status").notNull().default("queued"),
  logs:             text("logs").array().notNull().default([]),
  exitCode:         integer("exit_code"),
  executionTimeMs:  integer("execution_time_ms"),
  creditsUsed:      integer("credits_used"),
  createdAt:        timestamp("created_at").notNull().defaultNow(),
  startedAt:        timestamp("started_at"),
  completedAt:      timestamp("completed_at"),
});

export const insertComputeJobSchema = createInsertSchema(computeJobsTable).omit({ id: true, createdAt: true });
export type InsertComputeJob = z.infer<typeof insertComputeJobSchema>;
export type ComputeJob = typeof computeJobsTable.$inferSelect;
