import { defineAction, fail } from "@agent-native/core/action";
import { getRequestUserEmail } from "@agent-native/core/server/request-context";
import { z } from "zod";
import { getDb, schema } from "../server/db.js";
import { requireVisibleCampaign } from "../server/lib/campaign-access.js";

export default defineAction({
  description: "Send a message in a campaign's supporter group chat.",
  schema: z.object({
    campaignId: z.string().trim().min(1).describe("Campaign ID"),
    message: z
      .string()
      .trim()
      .min(1)
      .max(2000)
      .describe("Chat message"),
    senderName: z.string().trim().max(100).optional(),
  }),
  outputSchema: z.object({
    id: z.string(),
    campaignId: z.string(),
    senderEmail: z.string(),
    senderName: z.string().nullable(),
    message: z.string(),
    createdAt: z.string(),
  }),
  run: async ({ campaignId, message, senderName }) => {
    const senderEmail = getRequestUserEmail();
    if (!senderEmail) {
      fail("Authentication is required.", { statusCode: 401 });
    }

    await requireVisibleCampaign(campaignId, senderEmail);

    const [created] = await getDb()
      .insert(schema.campaignChatMessages)
      .values({
        id: crypto.randomUUID(),
        campaignId,
        senderEmail,
        senderName: senderName?.trim() || null,
        message,
        createdAt: new Date().toISOString(),
      })
      .returning();

    if (!created) {
      fail("Unable to send chat message.", { statusCode: 500 });
    }
    return created;
  },
});
