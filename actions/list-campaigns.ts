import { defineAction } from "@agent-native/core/action";
import { and, eq, ilike, inArray, or } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "../server/db.js";

export const PUBLIC_CAMPAIGN_STATUSES = ["published", "active", "completed", "submitted"] as const;

const campaignOutputSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  imageUrl: z.string().nullable(),
  country: z.string(),
  category: z.string(),
  currency: z.string().nullable(),
  targetAmount: z.number().nullable(),
  collectedAmount: z.number().nullable(),
  donorCount: z.number().nullable(),
  deadline: z.string().nullable(),
  status: z.string(),
});

export default defineAction({
  description: "List publicly available campaigns with optional search, category, country, and status filters.",
  schema: z.object({
    search: z.string().optional().describe("Optional search query matching title or description"),
    category: z.string().optional().describe("Optional campaign category filter"),
    country: z.string().optional().describe("Optional campaign country filter"),
    status: z
      .enum(["published", "active", "completed", "submitted"])
      .optional()
      .describe("Optional public status filter"),
  }),
  outputSchema: z.array(campaignOutputSchema),
  http: { method: "GET" },
  readOnly: true,
  requiresAuth: false,
  run: async ({ search, category, country, status }) => {
    const conditions = [inArray(schema.campaigns.status, [...PUBLIC_CAMPAIGN_STATUSES])];

    if (status) {
      conditions.push(eq(schema.campaigns.status, status));
    }
    if (category && category !== "All") {
      conditions.push(eq(schema.campaigns.category, category));
    }
    if (country && country !== "All Countries") {
      conditions.push(eq(schema.campaigns.country, country));
    }
    const trimmedSearch = search?.trim();
    if (trimmedSearch) {
      const pattern = `%${trimmedSearch}%`;
      const searchFilter = or(
        ilike(schema.campaigns.title, pattern),
        ilike(schema.campaigns.description, pattern),
      );
      if (searchFilter) {
        conditions.push(searchFilter);
      }
    }

    return getDb()
      .select({
        id: schema.campaigns.id,
        title: schema.campaigns.title,
        description: schema.campaigns.description,
        imageUrl: schema.campaigns.imageUrl,
        country: schema.campaigns.country,
        category: schema.campaigns.category,
        currency: schema.campaigns.currency,
        targetAmount: schema.campaigns.targetAmount,
        collectedAmount: schema.campaigns.collectedAmount,
        donorCount: schema.campaigns.donorCount,
        deadline: schema.campaigns.deadline,
        status: schema.campaigns.status,
      })
      .from(schema.campaigns)
      .where(and(...conditions))
      .limit(500);
  },
});
