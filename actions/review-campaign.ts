import { defineAction, fail } from "@agent-native/core/action";
import { getRequestUserEmail } from "@agent-native/core/server/request-context";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "../server/db.js";
import { assertAdmin } from "../server/lib/auth-roles.js";

const REVIEW_DECISIONS = [
  "approve",
  "reject",
  "request_changes",
  "suspend",
  "restore",
] as const;

export default defineAction({
  description:
    "Review a submitted campaign and transition its lifecycle status (Admin only).",
  schema: z.object({
    campaignId: z.string().trim().min(1).describe("The campaign ID to review"),
    decision: z.enum(REVIEW_DECISIONS).describe("Review decision"),
    notes: z
      .string()
      .trim()
      .max(1000)
      .optional()
      .describe("Review notes or requested changes for the coordinator"),
  }),
  outputSchema: z.object({
    campaignId: z.string(),
    newStatus: z.string(),
    approvalStatus: z.string(),
  }),
  run: async (input) => {
    const adminEmail = getRequestUserEmail();
    if (!adminEmail) {
      fail("Authentication required.", { statusCode: 401 });
    }

    // Role-based security: strictly verify administrative privileges
    await assertAdmin(adminEmail);

    const db = await getDb();
    const rows = await db
      .select()
      .from(schema.campaigns)
      .where(eq(schema.campaigns.id, input.campaignId))
      .limit(1);

    if (rows.length === 0 || !rows[0]) {
      fail("Campaign not found.", { statusCode: 404 });
    }
    const campaign = rows[0];

    let newStatus = campaign.status;
    let approvalStatus = campaign.approvalStatus;

    if (input.decision === "approve") {
      newStatus = "active";
      approvalStatus = "approved";
    } else if (input.decision === "reject") {
      newStatus = "rejected";
      approvalStatus = "rejected";
    } else if (input.decision === "request_changes") {
      newStatus = "changes_required";
      approvalStatus = "changes_required";
    } else if (input.decision === "suspend") {
      newStatus = "suspended";
    } else if (input.decision === "restore") {
      newStatus = "active";
    }

    const now = new Date().toISOString();

    await db
      .update(schema.campaigns)
      .set({
        status: newStatus,
        approvalStatus,
        reviewNotes: input.notes?.trim() || null,
        updatedAt: now,
      })
      .where(eq(schema.campaigns.id, input.campaignId));

    // Audit logging
    await db.insert(schema.auditLogs).values({
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actorEmail: adminEmail,
      actionType: `CAMPAIGN_REVIEW_${input.decision.toUpperCase()}`,
      entityType: "campaign",
      entityId: input.campaignId,
      details: JSON.stringify({
        decision: input.decision,
        notes: input.notes,
        previousStatus: campaign.status,
        newStatus,
      }),
      ipAddress: null,
      createdAt: now,
    });

    // Notify coordinator
    if (campaign.ownerEmail) {
      await db.insert(schema.notifications).values({
        id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userEmail: campaign.ownerEmail,
        type: "campaign_update",
        title: `Campaign Status Update: ${campaign.title}`,
        message:
          input.decision === "approve"
            ? "Your campaign has been approved and is now active for community support!"
            : input.decision === "request_changes"
              ? `Changes are required: ${input.notes || "Please check coordinator studio."}`
              : `Campaign status changed to ${newStatus}.`,
        link: `/member/campaigns/${campaign.id}`,
        isRead: false,
        createdAt: now,
      });
    }

    return {
      campaignId: input.campaignId,
      newStatus,
      approvalStatus,
    };
  },
});

