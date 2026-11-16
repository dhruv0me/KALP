import { defineAction, fail } from "@agent-native/core/action";
import { getRequestUserEmail } from "@agent-native/core/server/request-context";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "../server/db.js";

export default defineAction({
  description: "Record an expense item with receipt against a campaign or milestone.",
  schema: z.object({
    campaignId: z.string().trim().min(1).describe("The campaign ID"),
    milestoneId: z.string().trim().optional().describe("Optional associated milestone ID"),
    description: z.string().trim().min(3).max(500).describe("Expense description"),
    amount: z.number().int().positive().max(1_000_000_000).describe("Expense amount"),
    currency: z.string().trim().max(10).default("INR").describe("Currency"),
    uploadedReceipts: z.array(z.string().url()).max(5).optional().describe("Receipt URLs"),
  }),
  outputSchema: z.object({
    id: z.string(),
    campaignId: z.string(),
    description: z.string(),
    amount: z.number(),
    currency: z.string(),
    verificationStatus: z.string(),
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
    if (!isOwner) {
      const member = await db
        .select()
        .from(schema.campaignMembers)
        .where(
          and(
            eq(schema.campaignMembers.campaignId, input.campaignId),
            eq(schema.campaignMembers.userEmail, normalizedEmail),
          ),
        )
        .limit(1);

      if (member.length === 0) {
        fail("Unauthorized. Only campaign coordinators and members can record expenses.", {
          statusCode: 403,
        });
      }
    }

    const expenseId = `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    await db.insert(schema.campaignExpenses).values({
      id: expenseId,
      campaignId: input.campaignId,
      milestoneId: input.milestoneId?.trim() || null,
      description: input.description,
      amount: input.amount,
      currency: input.currency,
      uploadedReceipts: input.uploadedReceipts ? JSON.stringify(input.uploadedReceipts) : null,
      verificationStatus: "submitted",
      adminApprovalDetails: null,
      submittedByEmail: normalizedEmail,
      createdAt: now,
    });

    // Audit log
    await db.insert(schema.auditLogs).values({
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actorEmail: normalizedEmail,
      actionType: "EXPENSE_RECORDED",
      entityType: "expense",
      entityId: expenseId,
      details: JSON.stringify({
        campaignId: input.campaignId,
        amount: input.amount,
        currency: input.currency,
        description: input.description,
      }),
      ipAddress: null,
      createdAt: now,
    });

    return {
      id: expenseId,
      campaignId: input.campaignId,
      description: input.description,
      amount: input.amount,
      currency: input.currency,
      verificationStatus: "submitted",
    };
  },
});

