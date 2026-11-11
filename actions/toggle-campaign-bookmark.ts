import { defineAction, fail } from "@agent-native/core/action";
import { getRequestUserEmail } from "@agent-native/core/server/request-context";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "../server/db.js";
import { requireVisibleCampaign } from "../server/lib/campaign-access.js";

export default defineAction({
  description:
    "Save or unsave a campaign for the authenticated user.",
  schema: z.object({
    campaignId: z.string().trim().min(1).describe("Campaign ID"),
  }),
  outputSchema: z.object({
    campaignId: z.string(),
    saved: z.boolean(),
  }),
  run: async ({ campaignId }) => {
    const userEmail = getRequestUserEmail();
    if (!userEmail) {
      fail("Authentication is required.", { statusCode: 401 });
    }

    await requireVisibleCampaign(campaignId, userEmail);
    const db = getDb();

    const [existing] = await db
      .select({ id: schema.campaignBookmarks.id })
      .from(schema.campaignBookmarks)
      .where(
        and(
          eq(schema.campaignBookmarks.campaignId, campaignId),
          eq(schema.campaignBookmarks.userEmail, userEmail),
        ),
      )
      .limit(1);

    if (existing) {
      await db
        .delete(schema.campaignBookmarks)
        .where(
          and(
            eq(schema.campaignBookmarks.id, existing.id),
            eq(schema.campaignBookmarks.userEmail, userEmail),
          ),
        );
      return { campaignId, saved: false };
    }

    await db.insert(schema.campaignBookmarks).values({
      id: crypto.randomUUID(),
      campaignId,
      userEmail,
      createdAt: new Date().toISOString(),
    });
    return { campaignId, saved: true };
  },
});
