import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post(api.earlyAccess.create.path, async (req, res) => {
    try {
      const input = api.earlyAccess.create.input.parse(req.body);
      
      // Check if email already exists
      const existing = await storage.getEmail(input.email);
      if (existing) {
        return res.status(400).json({
          message: "This email is already on the early access list!",
          field: "email",
        });
      }

      const email = await storage.createEmail(input);
      res.status(201).json(email);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      return res.status(500).json({
        message: "An internal server error occurred.",
      });
    }
  });

  // Retention tracking
  app.post(api.retention.track.path, async (req, res) => {
    try {
      const input = api.retention.track.input.parse(req.body);
      const visit = await storage.recordPageVisit(input);
      res.status(201).json(visit);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      return res.status(500).json({ message: "An internal server error occurred." });
    }
  });

  app.get(api.retention.stats.path, async (_req, res) => {
    try {
      const stats = await storage.getRetentionStats();
      res.json(stats);
    } catch {
      return res.status(500).json({ message: "An internal server error occurred." });
    }
  });

  // Reviews
  app.post(api.reviews.create.path, async (req, res) => {
    try {
      const input = api.reviews.create.input.parse(req.body);
      const review = await storage.createReview(input);
      res.status(201).json(review);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      return res.status(500).json({ message: "An internal server error occurred." });
    }
  });

  app.get(api.reviews.list.path, async (_req, res) => {
    try {
      const reviews = await storage.getReviews();
      res.json(reviews);
    } catch {
      return res.status(500).json({ message: "An internal server error occurred." });
    }
  });

  return httpServer;
}
