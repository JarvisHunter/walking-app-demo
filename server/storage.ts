import { db } from "./db";
import {
  earlyAccessEmails,
  type InsertEmail,
  type EarlyAccessEmail
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  createEmail(email: InsertEmail): Promise<EarlyAccessEmail>;
  getEmail(email: string): Promise<EarlyAccessEmail | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createEmail(insertEmail: InsertEmail): Promise<EarlyAccessEmail> {
    const [email] = await db
      .insert(earlyAccessEmails)
      .values(insertEmail)
      .returning();
    return email;
  }

  async getEmail(email: string): Promise<EarlyAccessEmail | undefined> {
    const [result] = await db
      .select()
      .from(earlyAccessEmails)
      .where(eq(earlyAccessEmails.email, email));
    return result;
  }
}

export const storage = new DatabaseStorage();
