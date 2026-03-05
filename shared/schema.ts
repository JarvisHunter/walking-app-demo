import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const earlyAccessEmails = pgTable("early_access_emails", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pageVisits = pgTable("page_visits", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  page: text("page").notNull().default("/"),
  durationSeconds: integer("duration_seconds").notNull().default(0),
  emailId: integer("email_id").references(() => earlyAccessEmails.id),
  visitedAt: timestamp("visited_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEmailSchema = createInsertSchema(earlyAccessEmails).pick({
  email: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
});

export const insertPageVisitSchema = z.object({
  sessionId: z.string().min(1),
  page: z.string().min(1),
  durationSeconds: z.number().int().min(0),
  emailId: z.number().int().positive().optional(),
});

export const insertReviewSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  rating: z.number().int().min(1, "Rating must be at least 1").max(10, "Rating must be at most 10"),
  comment: z.string().min(1, "Comment is required").max(1000),
});

export type InsertEmail = z.infer<typeof insertEmailSchema>;
export type EarlyAccessEmail = typeof earlyAccessEmails.$inferSelect;
export type InsertPageVisit = z.infer<typeof insertPageVisitSchema>;
export type PageVisit = typeof pageVisits.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
