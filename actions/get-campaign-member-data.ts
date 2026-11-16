import { defineAction, fail } from "@agent-native/core/action";
import { getRequestUserEmail } from "@agent-native/core/server/request-context";
import { and, asc, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "../server/db.js";
import { requireVisibleCampaign } from "../server/lib/campaign-access.js";
import {
  parseProtectedProofs,
  parseRestrictedDocuments,
  protectedProofSchema,
  restrictedDocumentSchema,
} from "../server/lib/campaign-protected.js";

export default defineAction({
  description:
    "Fetch protected member details, documents, proofs, comments, chat, and bookmark state for a campaign.",
  schema: z.object({
    campaignId: z.string().trim().min(1).describe("Campaign ID"),
  }),
  outputSchema: z.object({
    campaignId: z.string(),
    isOwner: z.boolean(),
    isSaved: z.boolean(),
    ownerContact: z
      .object({
        name: z.string().nullable(),
        email: z.string().nullable(),
        contact: z.string().nullable(),
      })
      .nullable(),
    restrictedDocuments: z.array(restrictedDocumentSchema),
    protectedProofs: z.array(protectedProofSchema),
    milestones: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        proposedBudget: z.number(),
        deadline: z.string().nullable(),
        completionStatus: z.string(),
        approvalStatus: z.string(),
      }),
    ),
    comments: z.array(
      z.object({
        id: z.string(),
        authorEmail: z.string(),
        authorName: z.string().nullable(),
        body: z.string(),
        createdAt: z.string(),
      }),
    ),
    chatMessages: z.array(
      z.object({
        id: z.string(),
        senderEmail: z.string(),
        senderName: z.string().nullable(),
        message: z.string(),
        createdAt: z.string(),
      }),
    ),
  }),
  http: { method: "GET" },
  readOnly: true,
  run: async ({ campaignId }) => {
    const userEmail = getRequestUserEmail();
    if (!userEmail) {
      fail("Authentication is required.", { statusCode: 401 });
    }

    const db = getDb();
    const { campaign, isOwner } = await requireVisibleCampaign(
      campaignId,
      userEmail,
    );

    const [bookmarkRows, comments, chatMessages, milestones] = await Promise.all([
      db
        .select({ id: schema.campaignBookmarks.id })
        .from(schema.campaignBookmarks)
        .where(
          and(
            eq(schema.campaignBookmarks.campaignId, campaignId),
            eq(schema.campaignBookmarks.userEmail, userEmail),
          ),
        )
        .limit(1),
      db
        .select({
          id: schema.campaignComments.id,
          authorEmail: schema.campaignComments.authorEmail,
          authorName: schema.campaignComments.authorName,
          body: schema.campaignComments.body,
          createdAt: schema.campaignComments.createdAt,
        })
        .from(schema.campaignComments)
        .where(eq(schema.campaignComments.campaignId, campaignId))
        .orderBy(desc(schema.campaignComments.createdAt))
        .limit(100),
      db
        .select({
          id: schema.campaignChatMessages.id,
          senderEmail: schema.campaignChatMessages.senderEmail,
          senderName: schema.campaignChatMessages.senderName,
          message: schema.campaignChatMessages.message,
          createdAt: schema.campaignChatMessages.createdAt,
        })
        .from(schema.campaignChatMessages)
        .where(eq(schema.campaignChatMessages.campaignId, campaignId))
        .orderBy(asc(schema.campaignChatMessages.createdAt))
        .limit(100),
      db
        .select({
          id: schema.campaignMilestones.id,
          title: schema.campaignMilestones.title,
          description: schema.campaignMilestones.description,
          proposedBudget: schema.campaignMilestones.proposedBudget,
          deadline: schema.campaignMilestones.deadline,
          completionStatus: schema.campaignMilestones.completionStatus,
          approvalStatus: schema.campaignMilestones.approvalStatus,
        })
        .from(schema.campaignMilestones)
        .where(eq(schema.campaignMilestones.campaignId, campaignId))
        .orderBy(asc(schema.campaignMilestones.createdAt)),
    ]);

    const hasOwnerContact = Boolean(
      campaign.ownerName || campaign.ownerEmail || campaign.ownerContact,
    );

    return {
      campaignId,
      isOwner,
      isSaved: bookmarkRows.length > 0,
      ownerContact: hasOwnerContact
        ? {
            name: campaign.ownerName ?? null,
            email: campaign.ownerEmail ?? null,
            contact: campaign.ownerContact ?? null,
          }
        : null,
      restrictedDocuments: parseRestrictedDocuments(
        campaign.restrictedDocuments,
      ),
      protectedProofs: parseProtectedProofs(campaign.protectedProofs),
      milestones,
      comments,
      chatMessages,
    };
  },
});
