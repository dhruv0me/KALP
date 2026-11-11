import { defineAction, fail } from "@agent-native/core/action";
import { getRequestUserEmail } from "@agent-native/core/server/request-context";
import { z } from "zod";
import { getDb, schema } from "../server/db.js";
import { requireVisibleCampaign } from "../server/lib/campaign-access.js";

export default defineAction({
  description: "Post a member comment on a campaign.",
  schema: z.object({
    campaignId: z.string().trim().min(1).describe("Campaign ID"),
    body: z
      .string()
      .trim()
      .min(1)
      .max(2000)
      .describe("Comment message"),
    authorName: z.string().trim().max(100).optional(),
  }),
  outputSchema: z.object({
    id: z.string(),
    campaignId: z.string(),
    authorEmail: z.string(),
    authorName: z.string().nullable(),
    body: z.string(),
    createdAt: z.string(),
  }),
  run: async ({ campaignId, body, authorName }) => {
    const authorEmail = getRequestUserEmail();
    if (!authorEmail) {
      fail("Authentication is required.", { statusCode: 401 });
    }

    await requireVisibleCampaign(campaignId, authorEmail);

    const [created] = await getDb()
      .insert(schema.campaignComments)
      .values({
        id: crypto.randomUUID(),
        campaignId,
        authorEmail,
        authorName: authorName?.trim() || null,
        body,
        createdAt: new Date().toISOString(),
      })
      .returning();

    if (!created) {
      fail("Unable to save comment.", { statusCode: 500 });
    }
    return created;
  },
});
