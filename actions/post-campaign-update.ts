import { defineAction, fail } from "@agent-native/core/action";
import { getRequestUserEmail } from "@agent-native/core/server/request-context";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "../server/db.js";

export default defineAction({
  description: "Publish a public progress update for a campaign.",
  schema: z.object({
    campaignId: z.string().trim().min(1).describe("The campaign ID"),
    title: z.string().trim().min(3).max(160).describe("Update title"),
    content: z.string().trim().min(10).max(5000).describe("Update content"),
    images: z.array(z.string().url()).max(5).optional().describe("Optional progress images"),
  }),
  outputSchema: z.object({
    id: z.string(),
    campaignId: z.string(),
    title: z.string(),
    createdAt: z.string(),
  }),
  run: async (input) => {
    const userEmail = getRequestUserEmail();
    if (!userEmail) {
      fail("Authentication required.", { statusCode: 401 });
    }
    const normalizedEmail = userEmail.trim().toLowerCase();

    const db = await getDb();
    const campaign = await db
      .select()
      .from(schema.campaigns)
      .where(eq(schema.campaigns.id, input.campaignId))
      .limit(1);

    if (campaign.length === 0 || !campaign[0]) {
      fail("Campaign not found.", { statusCode: 404 });
    }

    const isOwner = campaign[0].ownerEmail === normalizedEmail;
    let authorName = campaign[0].ownerName || normalizedEmail;

    if (!isOwner) {
      const membership = await db
        .select()
        .from(schema.campaignMembers)
        .where(
          and(
            eq(schema.campaignMembers.campaignId, input.campaignId),
            eq(schema.campaignMembers.userEmail, normalizedEmail),
          ),
        )
        .limit(1);

      if (membership.length === 0) {
        fail("Unauthorized. Only campaign coordinators and members can post updates.", {
          statusCode: 403,
        });
      }
      if (membership[0]?.userName) {
        authorName = membership[0].userName;
      }
    }

    const updateId = `upd_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    await db.insert(schema.campaignUpdates).values({
      id: updateId,
      campaignId: input.campaignId,
      authorEmail: normalizedEmail,
      authorName,
      title: input.title,
      content: input.content,
      images: input.images ? JSON.stringify(input.images) : null,
      createdAt: now,
    });

    return {
      id: updateId,
      campaignId: input.campaignId,
      title: input.title,
      createdAt: now,
    };
  },
});

