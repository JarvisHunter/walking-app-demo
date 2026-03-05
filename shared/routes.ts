import { z } from "zod";
import { insertEmailSchema, earlyAccessEmails } from "./schema";

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
