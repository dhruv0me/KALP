import { defineAction, fail } from "@agent-native/core/action";
import { getRequestUserEmail } from "@agent-native/core/server/request-context";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "../server/db.js";

export default defineAction({
  description: "Add a new milestone with proposed budget to a campaign.",
  schema: z.object({
    campaignId: z.string().trim().min(1).describe("The campaign ID"),
    title: z.string().trim().min(3).max(160).describe("Milestone title"),
    description: z.string().trim().min(5).max(2000).describe("Milestone description"),
    proposedBudget: z.number().int().positive().max(1_000_000_000).describe("Proposed budget"),
    deadline: z.string().trim().max(40).optional().describe("Milestone target deadline"),
  }),
  outputSchema: z.object({
    id: z.string(),
    campaignId: z.string(),
    title: z.string(),
    proposedBudget: z.number(),
    completionStatus: z.string(),
  }),
  run: async (input) => {
    const userEmail = getRequestUserEmail();
    if (!userEmail) {
      fail("Authentication required.", { statusCode: 401 });
    }
    const normalizedEmail = userEmail.trim().toLowerCase();

    const db = await getDb();

    // Verify user is campaign owner or coordinator
    const campaign = await db
      .select()
      .from(schema.campaigns)
      .where(eq(schema.campaigns.id, input.campaignId))
      .limit(1);

    if (campaign.length === 0 || !campaign[0]) {
      fail("Campaign not found.", { statusCode: 404 });
    }

    const isOwner = campaign[0].ownerEmail === normalizedEmail;
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
        fail("Unauthorized. Only campaign coordinators and members can add milestones.", {
          statusCode: 403,
        });
      }
    }

    const milestoneId = `mls_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    await db.insert(schema.campaignMilestones).values({
      id: milestoneId,
      campaignId: input.campaignId,
      title: input.title,
      description: input.description,
      proposedBudget: input.proposedBudget,
      deadline: input.deadline?.trim() || null,
      completionStatus: "pending",
      approvalStatus: "pending",
      supportingDocuments: null,
      createdAt: now,
      updatedAt: now,
    });

    return {
      id: milestoneId,
      campaignId: input.campaignId,
      title: input.title,
      proposedBudget: input.proposedBudget,
      completionStatus: "pending",
    };
  },
});

