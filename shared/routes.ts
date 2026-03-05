import { z } from "zod";
import { insertEmailSchema, insertPageVisitSchema, insertReviewSchema, earlyAccessEmails, pageVisits, reviews } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  earlyAccess: {
    create: {
      method: 'POST' as const,
      path: '/api/early-access' as const,
      input: insertEmailSchema,
      responses: {
        201: z.custom<typeof earlyAccessEmails.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  retention: {
    track: {
      method: 'POST' as const,
      path: '/api/retention/track' as const,
      input: insertPageVisitSchema,
    },
    stats: {
      method: 'GET' as const,
      path: '/api/retention/stats' as const,
    },
  },
  reviews: {
    create: {
      method: 'POST' as const,
      path: '/api/reviews' as const,
      input: insertReviewSchema,
    },
    list: {
      method: 'GET' as const,
      path: '/api/reviews' as const,
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type EmailInput = z.infer<typeof api.earlyAccess.create.input>;
export type EmailResponse = z.infer<typeof api.earlyAccess.create.responses[201]>;
export type ValidationError = z.infer<typeof errorSchemas.validation>;
