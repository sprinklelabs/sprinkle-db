import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const contributorInterestsTable = pgTable("contributor_interests", {
  id:            text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name:          text("name").notNull(),
  email:         text("email").notNull(),
  walletAddress: text("wallet_address"),
  track:         text("track").notNull(), // relay_node | compute_node | storage_node | bug_bounty | open_source | docs
  message:       text("message"),
  createdAt:     timestamp("created_at").notNull().defaultNow(),
});

export type ContributorInterest = typeof contributorInterestsTable.$inferSelect;
