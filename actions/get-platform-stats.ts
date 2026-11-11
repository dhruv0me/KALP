import { defineAction } from "@agent-native/core/action";
import { and, count, inArray, isNotNull, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "../server/db.js";
import { PUBLIC_CAMPAIGN_STATUSES } from "./list-campaigns.js";

export default defineAction({
  description:
    "Aggregate real platform statistics from public campaigns in the database.",
  schema: z.object({}),
  outputSchema: z.object({
    totalPublicCampaigns: z.number(),
    totalActiveCampaigns: z.number(),
    totalCompletedCampaigns: z.number(),
    totalVerifiedDonors: z.number(),
    totalFundsCollected: z.number(),
    currency: z.string().nullable(),
  }),
  http: { method: "GET" },
  readOnly: true,
  requiresAuth: false,
  run: async () => {
    const db = getDb();
    const publicFilter = inArray(schema.campaigns.status, [
      ...PUBLIC_CAMPAIGN_STATUSES,
    ]);

    const [totals] = await db
      .select({
        totalPublicCampaigns: count(),
        totalActiveCampaigns: sql<number>`coalesce(sum(case when ${schema.campaigns.status} in ('published', 'active') then 1 else 0 end), 0)::int`,
        totalCompletedCampaigns: sql<number>`coalesce(sum(case when ${schema.campaigns.status} = 'completed' then 1 else 0 end), 0)::int`,
        totalVerifiedDonors: sql<number>`coalesce(sum(${schema.campaigns.donorCount}), 0)::int`,
        totalFundsCollected: sql<number>`coalesce(sum(${schema.campaigns.collectedAmount}), 0)::int`,
      })
      .from(schema.campaigns)
      .where(publicFilter);

    const currencies = await db
      .selectDistinct({ currency: schema.campaigns.currency })
      .from(schema.campaigns)
      .where(
        and(
          publicFilter,
          isNotNull(schema.campaigns.collectedAmount),
          isNotNull(schema.campaigns.currency),
        ),
      )
      .limit(2);

    const singleCurrency =
      currencies.length === 1 ? (currencies[0]?.currency ?? null) : null;

    return {
      totalPublicCampaigns: Number(totals?.totalPublicCampaigns ?? 0),
      totalActiveCampaigns: Number(totals?.totalActiveCampaigns ?? 0),
      totalCompletedCampaigns: Number(totals?.totalCompletedCampaigns ?? 0),
      totalVerifiedDonors: Number(totals?.totalVerifiedDonors ?? 0),
      totalFundsCollected: Number(totals?.totalFundsCollected ?? 0),
      currency: singleCurrency,
    };
  },
});
