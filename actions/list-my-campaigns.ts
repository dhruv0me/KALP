import { defineAction, fail } from "@agent-native/core/action";
import { getRequestUserEmail } from "@agent-native/core/server/request-context";
import { and, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "../server/db.js";
import { PUBLIC_CAMPAIGN_STATUSES } from "./list-campaigns.js";

const campaignSummarySchema = z.object({
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
  description:
    "List campaigns created by or saved by the authenticated user.",
  schema: z.object({}),
  outputSchema: z.object({
    created: z.array(campaignSummarySchema),
    saved: z.array(campaignSummarySchema),
  }),
  http: { method: "GET" },
  readOnly: true,
  run: async () => {
    const userEmail = getRequestUserEmail();
    if (!userEmail) {
      fail("Authentication is required.", { statusCode: 401 });
    }

    const db = getDb();
    const created = await db
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
      .where(eq(schema.campaigns.ownerEmail, userEmail))
      .orderBy(desc(schema.campaigns.createdAt))
      .limit(100);

    const bookmarks = await db
      .select({ campaignId: schema.campaignBookmarks.campaignId })
      .from(schema.campaignBookmarks)
      .where(eq(schema.campaignBookmarks.userEmail, userEmail))
      .orderBy(desc(schema.campaignBookmarks.createdAt))
      .limit(100);

    const savedIds = bookmarks.map((item) => item.campaignId);
    const saved =
      savedIds.length > 0
        ? await db
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
                inArray(schema.campaigns.id, savedIds),
                inArray(schema.campaigns.status, [...PUBLIC_CAMPAIGN_STATUSES]),
              ),
            )
            .limit(100)
        : [];

    return { created, saved };
  },
});
