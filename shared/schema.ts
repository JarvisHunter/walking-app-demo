import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const earlyAccessEmails = pgTable("early_access_emails", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEmailSchema = createInsertSchema(earlyAccessEmails).pick({
  email: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
});

export type InsertEmail = z.infer<typeof insertEmailSchema>;
export type EarlyAccessEmail = typeof earlyAccessEmails.$inferSelect;
