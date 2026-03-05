import { db } from "./db";
import {
  earlyAccessEmails,
  pageVisits,
  reviews,
  type InsertEmail,
  type EarlyAccessEmail,
  type InsertPageVisit,
  type PageVisit,
  type InsertReview,
  type Review,
} from "@shared/schema";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  createEmail(email: InsertEmail): Promise<EarlyAccessEmail>;
  getEmail(email: string): Promise<EarlyAccessEmail | undefined>;
  recordPageVisit(visit: InsertPageVisit): Promise<PageVisit>;
  getRetentionStats(): Promise<{
    totalVisits: number;
    uniqueSessions: number;
    avgDurationSeconds: number;
    visits: PageVisit[];
  }>;
  createReview(review: InsertReview): Promise<Review>;
  getReviews(): Promise<Review[]>;
  getReviewStats(): Promise<{ totalReviews: number; avgRating: number }>;
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

  async recordPageVisit(visit: InsertPageVisit): Promise<PageVisit> {
    const [result] = await db
      .insert(pageVisits)
      .values(visit)
      .returning();
    return result;
  }

  async getRetentionStats() {
    const [stats] = await db
      .select({
        totalVisits: sql<number>`count(*)::int`,
        uniqueSessions: sql<number>`count(distinct ${pageVisits.sessionId})::int`,
        avgDurationSeconds: sql<number>`coalesce(avg(${pageVisits.durationSeconds}), 0)::int`,
      })
      .from(pageVisits);

    const visits = await db
      .select({
        id: pageVisits.id,
        sessionId: pageVisits.sessionId,
        page: pageVisits.page,
        durationSeconds: pageVisits.durationSeconds,
        emailId: pageVisits.emailId,
        visitedAt: pageVisits.visitedAt,
        email: earlyAccessEmails.email,
      })
      .from(pageVisits)
      .leftJoin(earlyAccessEmails, eq(pageVisits.emailId, earlyAccessEmails.id))
      .orderBy(sql`${pageVisits.visitedAt} desc`)
      .limit(100);

    return {
      totalVisits: stats.totalVisits,
      uniqueSessions: stats.uniqueSessions,
      avgDurationSeconds: stats.avgDurationSeconds,
      visits,
    };
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [result] = await db
      .insert(reviews)
      .values(review)
      .returning();
    return result;
  }

  async getReviews(): Promise<Review[]> {
    return db
      .select()
      .from(reviews)
      .orderBy(sql`${reviews.createdAt} desc`);
  }

  async getReviewStats() {
    const [stats] = await db
      .select({
        totalReviews: sql<number>`count(*)::int`,
        avgRating: sql<number>`coalesce(round(avg(${reviews.rating})::numeric, 1), 0)::float`,
      })
      .from(reviews);
    return stats;
  }
}

export const storage = new DatabaseStorage();
