import { defineAction } from "@agent-native/core/action";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "../server/db.js";
import { PUBLIC_CAMPAIGN_STATUSES } from "./list-campaigns.js";

const campaignOutputSchema = z.object({
  campaign: z
    .object({
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
    })
    .nullable(),
});

export default defineAction({
  description: "Fetch a single publicly available campaign by id.",
  schema: z.object({
    id: z.string().describe("Campaign ID"),
  }),
  outputSchema: campaignOutputSchema,
  http: { method: "GET" },
  readOnly: true,
  requiresAuth: false,
  run: async ({ id }) => {
    const trimmedId = id.trim();
    if (!trimmedId) return { campaign: null };
    const [campaign] = await getDb()
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
      .where(
        and(
          eq(schema.campaigns.id, trimmedId),
          inArray(schema.campaigns.status, [...PUBLIC_CAMPAIGN_STATUSES]),
        ),
      )
      .limit(1);

    return { campaign: campaign ?? null };
  },
});

